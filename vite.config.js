export default defineConfig({
  // ✅ Replace 'elkateb--ai' with your exact GitHub repo name
base: '/Elkateb-AI/',  // ✅ exact repo name, case-sensitive
  plugins: [
    vue(),
    tailwindcss(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})