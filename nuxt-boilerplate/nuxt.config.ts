export default defineNuxtConfig({
  compatibilityDate: '2025-04-01',
  future: { compatibilityVersion: 4 },

  srcDir: './',

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'node-server',
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
    jwtExpiresIn: '7d',
    public: {
      apiBaseUrl: '/api',
    },
  },

  devtools: { enabled: true },

  typescript: {
    typeCheck: false,
    strict: false,
  },

  modules: [],

  imports: {
    autoImport: true,
  },

  components: {
    dirs: ['~/components/ui', '~/components/forms', '~/components/layout', '~/components'],
  },
})
