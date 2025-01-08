<template>
    <div class="max-w-[420px] w-full flex flex-col items-center justify-center">
        <h1 class="text-8xl font-bold text-center text-primary">{{ code }}</h1>
        <P class="text-lg mt-4 w-80 text-center">{{ content }}</P>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    code: {
        type: String,
        default: '404',  // Default color
    },
    content: {
        type: String,
        default: 'Not Found',  // Default color
    }
});
</script>