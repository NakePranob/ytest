// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/fonts',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/i18n'
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  app: {
    head: {
      script: [
        {
          src: 'https://www.google.com/recaptcha/api.js?render=explicit',
          type: 'text/javascript',
          defer: true,
        },
      ]
    }
  },
  i18n: {
    strategy: "prefix",
    vueI18n: "~/i18n/i18n.config.ts",
    defaultLocale: "en",
    lazy: true,
    locales: [
      {
        code: "en",
        language: "en-US",
        file: "en.json",
      },
      {
        code: "th",
        language: "th-TH",
        file: "th.json",
      },
    ],
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            "primary-app": {
              DEFAULT: "#E91C21", // สีหลัก
              100: '#E9A7A7', //FDE0E1
              200: '#EE8080',
              300: '#EE6B6B',
              400: '#E22E2E',
              500: '#E91C21',   // สีหลัก
              600: '#DF1818',
              700: '#CB1212',
              800: '#B90E0E',
              900: '#A50C0C',
              950: '#890A0A' // เข้มมาก
            },
            customGray: {
              50: '#FFFFFF',
              100: '#F5F7F9',
              200: '#DCE2E9',
              300: '#C3CED9',
              400: '#AABAC9',
              500: '#91A6B9',
              600: '#7891A9',
              700: '#617D98',
              800: '#51697F',
              900: '#415466',
              950: '#364655',
            },
          },
        },
      },
    },
  }
})