<template>
    <div class="h-full dark:bg-[#141418] text-[#231F20] dark:text-slate-50 max-w-screen">
        <div class="grid grid-cols-10">
            <div class="fixed top-4 items-center right-4 flex gap-2">
                <!-- Theme -->
                <button class="flex justify-center items-center me-2">
                    <template v-if="$colorMode.value === 'dark'">
                        <UTooltip :text="$t('switch-to-ligth')" :open-delay="300">
                            <UIcon name="i-heroicons-moon-solid" class="rounded-full sm:w-8 sm:h-8 h-8 w-8" @click.stop="() => {
                                $colorMode.preference = 'light'
                            }" />
                        </UTooltip>
                    </template>
                    <template v-else-if="$colorMode.value === 'light'">
                        <UTooltip :text="$t('switch-to-system')" :open-delay="300">
                            <UIcon name="i-heroicons-sun-solid" class="rounded-full sm:w-8 sm:h-8 h-8 w-8" @click.stop="() => {
                                $colorMode.preference = 'system'
                            }" />
                        </UTooltip>
                    </template>
                    <template v-else>
                        <UTooltip :text="$t('switch-to-dark')" :open-delay="300">
                            <UIcon name="i-heroicons-computer-desktop-solid" class="rounded-full sm:w-8 sm:h-8 h-8 w-8"
                                @click.stop="() => {
                                    $colorMode.preference = 'dark'
                                }" />
                        </UTooltip>
                    </template>
                </button>
                <!-- Language -->
                <button class="flex justify-center items-center">
                    <template v-if="getLocaleCookie() === 'en'">
                        <UTooltip text="เปลี่ยนเป็นภาษาไทย" :open-delay="300">
                            <NuxtImg class="rounded-full sm:w-8 sm:h-8 h-8 w-8" src="/flag-th.jpg"
                                @click.stop="setLocale('th')" />
                        </UTooltip>
                    </template>
                    <template v-else>
                        <UTooltip text="Switch to English" :open-delay="300">
                            <NuxtImg class="rounded-full sm:w-8 sm:h-8 h-8 w-8" src="/flag-en.png"
                                @click.stop="setLocale('en')" />
                        </UTooltip>
                    </template>
                </button>
            </div>
            <!-- Left Section: Background Image -->
            <div class="hidden lg:block lg:col-span-6 h-screen relative">
                <NuxtImg src="/logoBaner.png" class="absolute object-fill left-1/2 top-8 -translate-x-1/2 h-96"
                    alt="logoBaner" />
                <NuxtImg src="/baner.png" class=" absolute top-16 h-[72px] left-1/2 -translate-x-1/2" alt="baner" />
                <NuxtImg src="/city.png" class="absolute bottom-20 left-0 w-full" alt="city" />
                <NuxtImg src="/member.png" class="absolute object-fill bottom-8 left-1/2 -translate-x-1/2 h-[316.5px]"
                    alt="member" />
                <NuxtImg src="/bg.jpg" class="w-full h-full object-cover" alt="Background Image" />
            </div>
            <!-- Right Section: Slot Content -->
            <div :class="auth.formElementHight > bodyHeight ? 'justify-start py-8' : 'justify-center'"
                class="col-span-10 lg:col-span-4 h-screen overflow-y-auto flex flex-col items-center px-4">
                <slot />
            </div>
            <UNotifications>
                <template #title="{ title }">
                    <span class="font-base" v-html="title" />
                </template>

                <template #description="{ description }">
                    <span class="font-base" v-html="description" />
                </template>
            </UNotifications>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

useHead({
  title: 'M - Authen 2.0',
  meta: [
    { name: 'description', content: 'Authen 2.0' },
    { name: 'keywords', content: 'The Mall' },
    { name: 'author', content: 'The Mall' },
    { property: 'og:title', content: 'M - Authen 2.0' },
    { property: 'og:description', content: 'Authen 2.0' },
    { property: 'og:image', content: '/logo.png' },
    { property: 'og:url', content: 'https://uat-mauthen.themall.co.th/th/login' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/logo.png' }
  ]
})

const { locale, setLocale, getLocaleCookie } = useI18n();
const auth = useAuthStore();
const bodyHeight = ref();

const language = [{
    name: 'English',
    value: 'en'
}, {
    name: 'Thailand',
    value: 'th',
}]

const lang = ref(locale.value as 'en' | 'th')

watch(lang, (newlang, Oldlang) => {
    setLocale(newlang)
})

onMounted(() => {
    bodyHeight.value = document.body.clientHeight
});
</script>

<style scoped>
*, .font-base {
    font-family: "Noto Sans Thai", serif !important;
}
</style>
