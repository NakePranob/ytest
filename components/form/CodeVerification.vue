<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth';import { useI18n } from 'vue-i18n'
const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();
const auth = useAuthStore();
const toast = useToast();
const formElement = ref();
const email = ref('');
const isLoading = ref(false);

function maskEmail(email: string) {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart = localPart[0] + "*".repeat(localPart.length - 1);
    const domainParts = domain.split(".");
    const maskedDomain = domainParts[0][0] + "*".repeat(domainParts[0].length - 1) + ".";
    return `${maskedLocalPart}@${maskedDomain}`;
}

const schema = z.object({
    code: z.string({ message: 'code-policy-required' }),
})

type Schema = z.output<typeof schema>

const state = reactive({
    code: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
        console.log(event.data)

        const { data, error } = await useFetch(`${runtimeConfig.public.apiBase}/api/v1/auth/register${auth.uri}`, {
            method: 'POST',
            body: {
                username: auth.codeVerification.email,
                password: auth.codeVerification.password,
                otp: event.data.code,
                sessionId: auth.codeVerification.sessionId,
            },
            credentials: 'include',
        });

        if (error.value) {
            console.error("Error message from server:", error || "Unknown error occurred");
            if (error.value?.data.code === "InvalidCodeException") {
                toast.add({ title: t('noti-invalid-code-exception'), icon: "i-heroicons-x-circle" });
            } else {
                toast.add({ title: t('noti-unknown-exception'), icon: "i-heroicons-x-circle" });
            }
            return;
        }

        if (data.value) {
            auth.setPageView('');
            auth.setNotiSuccess({
                isOpen: true,
                state: 'success',
                url: `http://localhost:3000/login${auth.uri}`,
                message: 'noti-success-sign-up-title',
                description: 'noti-success-sign-up-description',
            });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        toast.add({ title: 'An unexpected error occurred' });
    } finally {
        isLoading.value = false;
    }
}

async function resendCode() {
    if (isLoading.value) return;
    isLoading.value = true;
    
    try {
        const formData = {
            username: auth.codeVerification.email,
            password: auth.codeVerification.password,
        }
        const { data, error } = await useFetch<{
            sessionId: string,
            message: string,
        }>(`${runtimeConfig.public.apiBase}/api/v1/auth/register${auth.uri}`, {
            method: "POST",
            body: formData,
        });

        if (error.value) {
            console.error("Error message from server:", error || "Unknown error occurred");
            if (error.value?.data.code === "UserAlreadyExistsException") {
                toast.add({ title: t('noti-user-already-exists-exception'), icon: "i-heroicons-x-circle" });
            } else if (error.value.data.code === 'MissingRequiredFieldsException') {
                toast.add({ title: t('noti-missing-required-exception'), icon: "i-heroicons-x-circle" });
            } else {
                toast.add({ title: error.value?.data.message || 'Unknown error occurred', icon: "i-heroicons-x-circle" });
            }
            return;
        }

        if (data.value) {
            auth.setCodeVerification({
                email: auth.codeVerification.email,
                password: auth.codeVerification.password,
                sessionId: data.value.sessionId,
                code: '',
            });
            toast.add({ title: t('noti-resent-code'), color:"green", icon:"i-heroicons-check-circle" });
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        toast.add({ title: 'An unexpected error occurred' });
    } finally {
        isLoading.value = false;
        resetCountdown();
    }
}

const countdown = reactive({
    timeLeft: 10 * 60, // 10 minutes (600 seconds)
    isFinished: false, // เพิ่ม state เพื่อตรวจสอบว่าการนับสิ้นสุดหรือไม่
});

const formattedCountdown = computed(() => {
    const minutes = Math.floor(countdown.timeLeft / 60);
    const seconds = countdown.timeLeft % 60;
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
});

let countdownInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
    getElementHeight();
    if (process.client) {
        startCountdown();
        email.value = maskEmail(auth.codeVerification.email);
    }
});

const getElementHeight = () => {
    if (formElement.value) {
        const height = formElement.value.offsetHeight;
        console.log('Height of the element:', height);
        auth.setFormElementHight(height);
    }
};

onUnmounted(() => {
    stopCountdown();
});

function resetCountdown() {
    countdown.timeLeft = 10 * 60; // รีเซ็ตเวลาเป็น 10 นาที
    countdown.isFinished = false; // รีเซ็ตสถานะการนับ
    startCountdown(); // เริ่มนับใหม่
}

function startCountdown() {
    if (countdownInterval) return;
    countdownInterval = setInterval(() => {
        if (countdown.timeLeft > 0) {
            countdown.timeLeft -= 1;
        } else {
            countdown.isFinished = true; // ตั้งค่าเป็น true เมื่อเวลาสิ้นสุด
            stopCountdown();
        }
    }, 1000);
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}
</script>

<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center">
        <NuxtImg src="/logo.png" class="w-20" />
        <div class="flex flex-col justify-center gap-2 my-8 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">{{
                $t('code-verification-title') }}</h1>
            <p class="text-base">
                {{ $t('code-verification-description') }}
                <b class="text-primary-app dark:text-primary-app-400 font-bold">
                    {{ email }}
                </b>
            </p>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <TFormGroup name="code" :label="$t('code-verification-label')">
                <UInput v-model="state.code" size="xl" inputClass="text-center py-4 text-base mt-1"
                    :placeholder="$t('code-verification-placeholder')" />
            </TFormGroup>
            <UButton :loading="isLoading" type="submit" block size="xl" :padded="false" :ui="{ font: '!text-base' }"
                class="dark:text-slate-100 py-4">
                <template v-if="isLoading" #leading>
                    <Circular size="16" color="white" />
                </template>
                {{ $t('verify-button') }}
            </UButton>
        </UForm>
        <div class="mt-8 flex flex-col items-center justify-center text-base">
            <div class="flex-1 flex flex-col items-center justify-center gap-2">
                <span>{{ $t('did-not-receive', { value: 'Code' }) }}</span>
                <template v-if="!countdown.isFinished">
                    <b class="text-primary-app dark:text-primary-app-400 font-bold">
                        {{ $t('resend-otp-in') }} {{ formattedCountdown }}
                    </b>
                </template>
                <template v-else>
                    <b @click="resendCode" class="text-primary-app hover:scale-105 cursor-pointer 
                    transition-all duration-150 ease-in-out dark:text-primary-app-400 font-bold">
                        {{ $t('resend-otp') }}
                    </b>
                </template>
            </div>
            <NuxtLink @click="auth.setPageView('')" :to="`/login${auth.uri}`"
                class="font-bold mt-8 flex gap-2 items-center">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> {{ $t('back-to-sign-in') }}
            </NuxtLink>
        </div>
    </div>
</template>
