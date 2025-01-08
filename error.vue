<script setup lang="ts">
import type { NuxtError } from '#app'
import ErrorPage from './components/ErrorPage.vue';

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <div class="h-full dark:bg-zinc-950">
        <div class="grid grid-cols-10">
            <!-- Left Section: Background Image -->
            <div class="hidden lg:block lg:col-span-6 h-screen relative">
                <NuxtImg src="/logoBaner.png" class="absolute object-fill left-1/2 top-8 -translate-x-1/2 h-96" alt="logoBaner" />
                <NuxtImg src="/baner.png" class=" absolute top-16 h-[61.111px] left-1/2 -translate-x-1/2" alt="baner" />
                <NuxtImg src="/city.png" class="absolute bottom-20 left-0 w-full" alt="city" />
                <NuxtImg src="/member.png" class="absolute object-fill bottom-8 left-1/2 -translate-x-1/2 h-[316.5px]" alt="member" />
                <NuxtImg src="/bg.jpg" class="w-full h-full object-cover" alt="Background Image" />
            </div>
            <!-- Right Section: Slot Content -->
            <div class="col-span-10 lg:col-span-4 h-screen overflow-y-auto flex flex-col items-center justify-center px-4">
                <ErrorPage/>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
