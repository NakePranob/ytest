<script setup lang="ts">
const props = defineProps<{
    name: string;
    label?: string;
    description?: string;
    hint?: string;
    [key: string]: unknown; // Extendable for additional props
}>();
</script>

<template>
    <UFormGroup v-bind="props">
        <template #label="{label}">
            <label class="text-base">{{ label }}</label>
        </template>
        <template #default="{}">
            <slot />
        </template>
        <template #error="{ error }">
            <span v-if="error" :class="'text-red-500 dark:text-red-400'">
                {{ $t(error, { atSignSymbol: '@'}) }}
            </span>
        </template>
    </UFormGroup>
</template>
