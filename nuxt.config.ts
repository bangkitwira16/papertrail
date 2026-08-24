import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    dataFile: process.env.DATA_FILE || '.data/papertrail.json',
    public: { appName: 'Papertrail' }
  },
  app: {
    head: {
      title: 'Papertrail — collaborative documents',
      meta: [
        { name: 'description', content: 'A focused collaborative document workspace.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  typescript: { strict: true, typeCheck: true }
})
