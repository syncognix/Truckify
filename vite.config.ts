import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const CHUNKS: [chunk: string, packages: string[]][] = [
  ['scroll', ['gsap', '@gsap', 'lenis']],
  ['react', ['react', 'react-dom', 'scheduler']],
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Keep the framework and scroll runtime in their own long-cacheable chunks. Motion is
        // left to the bundler so LazyMotion's async features split out.
        manualChunks(id) {
          const path = id.split('\\').join('/')
          for (const [chunk, packages] of CHUNKS) {
            if (packages.some((p) => path.includes(`/node_modules/${p}/`))) return chunk
          }
        },
      },
    },
  },
})
