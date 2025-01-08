<script lang="ts" setup>
import SignUp from '@/components/form/SignUp.vue';
import { useAuthStore } from '@/stores/auth'
import CodeVerification from '@/components/form/CodeVerification.vue';
import FormNoti from '@/components/form/FormNoti.vue';
import { useRoute } from 'vue-router';
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const queryParams = route.query;

const auth = useAuthStore();
const client_id = ref('Client Id');

onMounted(() => {
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
    const fullUri = `?${Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join('&')}`;
    console.log(fullUri);
    auth.setUri(fullUri);
});

onMounted(async () => {
    try {
        const res = await $fetch<{
            message: {
                MinimumLength: number;
                RequireUppercase: boolean;
                RequireLowercase: boolean;
                RequireSymbols: boolean;
                RequireNumbers: boolean;
                TemporaryPasswordValidityDays: number;
            };
        }>(`${runtimeConfig.public.apiBase}/api/v1/auth/passwordpolicy`);

        console.log('Password Policy:', res.message);
        if (res.message) {
            console.log('Password Policy:', res.message);
            auth.setPasswordPolicy({
                MinimumLength: res.message.MinimumLength,
                RequireUppercase: res.message.RequireUppercase,
                RequireLowercase: res.message.RequireLowercase,
                RequireSymbols: res.message.RequireSymbols,
                RequireNumbers: res.message.RequireNumbers,
            });
            let height = 18 * 2;
            if (res.message.MinimumLength > 0) height += 18;
            if (res.message.RequireUppercase) height += 18;
            if (res.message.RequireLowercase) height += 18;
            if (res.message.RequireSymbols) height += 18;
            if (res.message.RequireNumbers) height += 18;
            auth.setPasswordPolicyHeight(height);
        }
    } catch (error) {
        console.error('Error fetching password policy:', error);
    }
});
</script>

<template>
    <div v-if="!client_id">
        <ErrorPage code="Oops!" content="Required String parameter 'client_id' is not present"/>
    </div>
    <div v-else class="max-w-[420px] w-full">
        <SignUp v-if="auth.pageView != 'codeVerification' && !auth.notiSuccess.isOpen" />
        <CodeVerification v-else-if="auth.pageView == 'codeVerification'" />
        <FormNoti v-else-if="auth.notiSuccess.isOpen" />
    </div>
</template>