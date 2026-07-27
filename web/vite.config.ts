import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // ffmpeg.wasm 相关包不能被 vite 预打包，否则 worker 加载会失败
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
})
