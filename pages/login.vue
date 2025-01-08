<script setup lang="ts">
import SignIn from '@/components/form/SignIn.vue';
import { useAuthStore } from '@/stores/auth'
import OTP from '@/components/form/OTP.vue';
import ChangePassword from '@/components/form/ChangePassword.vue';
import FormNoti from '@/components/form/FormNoti.vue';
import { useRoute } from 'vue-router';
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const queryParams = route.query;
const toast = useToast();
const auth = useAuthStore();
const client_id = ref('Client Id');

onMounted(async () => {
    console.log("Page", auth.pageView)
    client_id.value = new URLSearchParams(window.location.search).get('client_id') || '';
    const fullUri = `?${Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join('&')}`;
    console.log(fullUri);
    auth.setUri(fullUri);

    const { data, error } = await useFetch<{
        message: {
            MinimumLength: number;  
            RequireUppercase: boolean;
            RequireLowercase: boolean;
            RequireSymbols: boolean;
            RequireNumbers: boolean;
            TemporaryPasswordValidityDays: number;
        };
    }>(`${runtimeConfig.public.apiBase}/api/v1/auth/passwordpolicy`);

    if (error.value) {
        toast.add({ title: error.value?.data.message });
        return;
    }

    if (data.value) {
        console.log('Password Policy:', data.value.message);
        auth.setPasswordPolicy({
            MinimumLength: data.value.message.MinimumLength,
            RequireUppercase: data.value.message.RequireUppercase,
            RequireLowercase: data.value.message.RequireLowercase,
            RequireSymbols: data.value.message.RequireSymbols,
            RequireNumbers: data.value.message.RequireNumbers,
        });
        let height = 18 * 3;
        if (data.value.message.RequireUppercase) height += 18;
        if (data.value.message.RequireLowercase) height += 18;
        if (data.value.message.RequireSymbols) height += 18;
        if (data.value.message.RequireNumbers) height += 18;
        auth.setPasswordPolicyHeight(height);
    }
});
</script>

<template>
    <div v-if="!client_id">
        <ErrorPage code="Oops!" content="Required String parameter 'client_id' is not present"/>
    </div>
    <div v-else class="max-w-[420px] w-full">
        <SignIn v-if="auth.pageView != 'changePassword' && auth.pageView != 'otp' && !auth.notiSuccess.isOpen" />
        <ChangePassword v-else-if="auth.pageView == 'changePassword'" />
        <OTP v-else-if="auth.pageView == 'otp'" />
        <FormNoti v-else-if="auth.notiSuccess.isOpen" />
    </div>
</template>