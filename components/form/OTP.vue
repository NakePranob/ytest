<script setup lang="ts">
import { z } from 'zod';
import { reactive, computed, onMounted, onUnmounted } from 'vue';
import type { FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n'
const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();
const auth = useAuthStore();
const xsrfToken = useCookie('XSRFTOKEN');
const toast = useToast();
const formElement = ref<HTMLFormElement | null>(null);
const client_id = ref('');
const redirectUri = ref('');
const email = ref(''); ''
const isLoading = ref(false);

function maskEmail(email: string) {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart = localPart[0] + "*".repeat(localPart.length - 1);
    const domainParts = domain.split(".");
    const maskedDomain = domainParts[0][0] + "*".repeat(domainParts[0].length - 1) + ".";
    return `${maskedLocalPart}@${maskedDomain}`;
}

const schema = z.object({
    otp: z.string({ message: 'otp-policy-required' }).min(6, 'otp-policy-length'),
});

type Schema = z.output<typeof schema>;

const state = reactive({
    otp: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
        console.log(event.data);

        const { data, error } = await useFetch<{
            redirectUrl: string;
        }>(`${runtimeConfig.public.apiBase}/api/v1/auth/respond-to-challenge${auth.uri}`, {
            method: 'POST',
            body: {
                username: auth.otp.email,
                password: auth.otp.password,
                challengeName: auth.otp.challengeName,
                session: auth.otp.session,
                challengeResponses: {
                    ANSWER: event.data.otp
                }
            },
            credentials: 'include',
        });

        if (error.value) {
            console.error('Error message from server:', error || 'Unknown error occurred');
            if (error.value.data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                toast.add({ title: t('noti-new-password-required-exception'), icon: "i-heroicons-x-circle" });
                auth.setChangPassword({
                    session: error.value.data.Session,
                    email: error.value.data.ChallengeParameters.userAttributes.email,
                });
                auth.setPageView('changePassword');
            } else {
                if (error.value.data.code === 'MissingRequiredFieldsException') {
                    toast.add({ title: t('noti-missing-required-exception'), icon: "i-heroicons-x-circle" });
                } else if (error.value.data.code === 'NotAuthorizedException') {
                    toast.add({ title: t('noti-invalid-otp'), icon: "i-heroicons-x-circle" });
                } else if (error.value.data.code === 'UserLambdaValidationException') {
                    toast.add({ title: t('noti-user-lambda-validation-exception'), icon: "i-heroicons-x-circle" });
                } else {
                    toast.add({ title: t('noti-unknown-exception'), icon: "i-heroicons-x-circle" });
                }
            }
            return;
        }

        if (data.value) {
            window.location.href = data.value.redirectUrl;
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        toast.add({ title: 'An unexpected error occurred' });
    } finally {
        isLoading.value = false;
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
    redirectUri.value = new URLSearchParams(window.location.search).get('redirect_uri') || '';
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
    nextTick(() => {
        startCountdown();
        getElementHeight();
    });
    if (auth.otp.email.includes('@')) {
        email.value = maskEmail(auth.otp.email);
    } else {
        email.value = "+********" + auth.otp.email.slice(-2);
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

async function resendOTP() {
    countdown.timeLeft = 10 * 60;
    countdown.isFinished = false;
    startCountdown();

    if (isLoading.value) return;
    isLoading.value = true;

    try {
        const { data, error } = await useFetch<{
            challengeName: string,
            session: string,
        }>(`${runtimeConfig.public.apiBase}/api/v1/auth/login${auth.uri}`, {
            method: 'POST',
            credentials: 'include',
            body: {
                username: auth.otp.email,
                password: auth.otp.password,
                _csrf: xsrfToken.value || '',
            },
        });

        if (error.value) {
            console.error('Error message from server:', error || 'Unknown error occurred');
            if (error.value.data.code === 'NotAuthorizedException') {
                toast.add({ title: t('sign-in-noti-not-authorized-exception'), icon: "i-heroicons-x-circle" });
            } else if (error.value.data.code === 'MissingRequiredFieldsException') {
                toast.add({ title: t('noti-missing-required-exception'), icon: "i-heroicons-x-circle" });
            } else if (error.value.data.code === 'InvalidEmailException') {
                toast.add({ title: t('noti-invalid-email-exception'), icon: "i-heroicons-x-circle" });
            } else if (error.value.data.code === 'InvalidCSRFTokenException') {
                toast.add({ title: t('noti-invalid-csrf-token-exception'), icon: "i-heroicons-x-circle" });
            } else if (error.value.data.code === 'AuthorizedFail') {
                toast.add({ title: t('noti-authentication-failed'), icon: "i-heroicons-x-circle" });
            } else {
                toast.add({ title: t('noti-unknown-exception'), icon: "i-heroicons-x-circle" });
            }
            return;
        }

        if (data.value) {
            if (data.value.challengeName === 'CUSTOM_CHALLENGE') {
                auth.setOTP({
                    email: auth.otp.email,
                    password: auth.otp.password,
                    session: data.value.session,
                    challengeName: data.value.challengeName,
                });
                toast.add({ title: t('noti-resent-otp'), color:"green", icon:"i-heroicons-check-circle" });
            }
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        toast.add({ title: 'An unexpected error occurred' });
    } finally {
        isLoading.value = false;
    }
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
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center gap-y-4">
        <NuxtImg src="/logo.png" class="w-20" />
        <div class="flex flex-col justify-center gap-2 mt-6 mb-4 w-full">
            <h1 class="text-[32px] font-bold text-primary-app dark:text-primary-app-400">{{ $t('otp-verification-title')
                }}</h1>
            <p class="text-base">
                {{ auth.otp.email.includes('@') ? $t('otp-verification-description-email') :
                    $t('otp-verification-description-phone') }}
                <b class="text-primary-app dark:text-primary-app-400 font-bold text-base mb-2">{{ email }}</b>
            </p>
        </div>
        <UForm :schema="schema" :state="state" class="space-y-8 w-full" @submit="onSubmit">
            <TFormGroup name="otp">
                <label>
                    {{ $t('otp-verification-label-leading') }}
                    <b>{{ $t('otp-verification-label-center') }}</b>
                    {{ $t('otp-verification-label-trailing') }}
                </label>
                <UInput v-model="state.otp" size="xl" :placeholder="$t('otp-verification-placeholder')" maxlength="8"
                    inputClass="text-center py-4 text-base mt-1" />
            </TFormGroup>
            <TFormGroup>
                <UButton :loading="isLoading" type="submit" block size="xl" :padded="false" :ui="{
                    font: '!text-base',
                }" class="dark:text-slate-100 py-4">
                    <template v-if="isLoading" #leading>
                        <Circular size="16" color="white" />
                    </template>
                    {{ $t('verify-button') }}
                </UButton>
            </TFormGroup>
        </UForm>
        <div class="mt-4 flex flex-col items-center justify-center text-base">
            <div class="flex-1 flex flex-col items-center justify-center gap-2">
                <span>{{ $t('did-not-receive', { value: 'OTP' }) }}</span>
                <template v-if="!countdown.isFinished">
                    <b class="text-primary-app dark:text-primary-app-400 font-bold">
                        {{ $t('resend-otp-in') }} {{ formattedCountdown }}
                    </b>
                </template>
                <template v-else>
                    <b @click="resendOTP" class="text-primary-app hover:scale-105 cursor-pointer 
                    transition-all duration-150 ease-in-out dark:text-primary-app-400 font-bold">
                        {{ $t('resend-otp') }}
                    </b>
                </template>
            </div>
            <span @click="auth.setPageView('')" class="font-bold mt-6 flex gap-2 items-center cursor-pointer
            transition-all duration-150 ease-in-out hover:gap-4">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> {{ $t('back-to-sign-in') }}
            </span>
        </div>
    </div>
</template>
