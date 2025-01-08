<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center space-y-8">
        <NuxtImg :src="auth.notiSuccess.state === 'success' ? '/check.png' : '/error.png'" class="w-28" />
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-[32px] font-bold">{{ $t(auth.notiSuccess.message) }}</h1>
            <span :class="auth.notiSuccess.state === 'success' ? 'text-base mt-2 text-center' : 'text-sm mt-2 text-center whitespace-nowrap'">
                {{ $t(auth.notiSuccess.description) }}
            </span>
        </div>
        <div v-if="auth.notiSuccess.state === 'success'" class="flex flex-col items-center justify-center">
            <div class="pb-8">
                <Circular size="24" color="#E91C21" />
            </div>
            <span class="text-base">
                {{ $t('noti-redirecting-in') }} {{ second }}
            </span>
        </div>
        <div class="w-full" :class="{'pt-6': auth.notiSuccess.state === 'error'}">
            <UButton @click="skip" block size="xl" :padded="false" :ui="{ font: '!text-base' }" class="dark:text-slate-100 py-4">
                <template v-if="auth.notiSuccess.state === 'success'">
                    {{ $t('noti-success-button') }}
                </template>
                <template v-else>
                    {{ $t('noti-error-button') }}
                </template>
            </UButton>
        </div>
        <template v-if="auth.notiSuccess.state === 'error'">
            <NuxtLink @click="auth.setPageView('')" :to="`http://localhost:3000/login${auth.uri}`" class="font-bold flex gap-2 hover:gap-4 transition-all duration-300 ease-in-out pt-2">
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" /> {{ $t('back-to-sign-in') }}
            </NuxtLink>
        </template>
    </div>
</template>

<script lang="ts" setup>
import Circular from '@/components/Circular.vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

function skip() {
    auth.setPageView("");
    window.location.href = auth.notiSuccess.url;
}

function countdown(seconds: number) {
    let timeLeft = seconds;

    const intervalId = setInterval(() => {
        timeLeft--;
        second.value = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(intervalId);
            skip();
        }
    }, 1000);
}

const second = ref(3);
onMounted(() => {
    if (auth.notiSuccess.state === 'success') {
        countdown(3);
    }
});
</script>
