import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import * as path from 'path'

// Manually load .env.production for build time
const envPath = path.resolve(__dirname, '.env.production')
let envVars: Record<string, string> = {}

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      envVars[key.trim()] = value.trim()
    }
  })
  console.log('✅ Loaded .env.production:', Object.keys(envVars))
}

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  define: {
    'import.meta.env.VITE_ANTHROPIC_API_KEY': JSON.stringify(envVars.VITE_ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || '')
  }
})
