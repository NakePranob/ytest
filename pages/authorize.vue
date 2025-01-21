<template>
    <div>
    </div>
</template>

<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const queryParams = route.query;

onMounted(() => {
    const fullUri = `?${Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join('&')}`;
    console.log(fullUri);
    window.location.href = `${runtimeConfig.public.apiBase}/api/v1/auth/authorize${fullUri}`;
})
</script>