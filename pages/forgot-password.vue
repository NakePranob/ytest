<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import ForgotPassword from '@/components/form/ForgotPassword.vue';
import FormNoti from '@/components/form/FormNoti.vue';
import ConfirmPassword from '@/components/form/ConfirmPassword.vue';
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
            throw new Error(error.value.message);
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
        <ForgotPassword v-if="auth.pageView != 'confirmPassword' && !auth.notiSuccess.isOpen" />
        <ConfirmPassword v-else-if="auth.pageView == 'confirmPassword'" />
        <FormNoti v-else-if="auth.notiSuccess.isOpen" />
    </div>
</template>