import { defineConfig } from 'vite';
import { cp, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Copy the repo packs/ + spec/ into the viewer dist so the built viewer can fetch
// a cityPack at runtime without bundling every pack into the JS. Pure renderer,
// no runtime ML; packs are static JSON.
function copyPacksPlugin() {
  const root = resolve(__dirname, '..');
  return {
    name: 'copy-packs',
    async buildStart() {
      const dest = resolve(__dirname, 'public/packs');
      if (!existsSync(dest)) await mkdir(dest, { recursive: true });
      await cp(resolve(root, 'packs/ile-de-la-cite-block'), resolve(dest, 'ile-de-la-cite-block'), { recursive: true, force: true });
      await cp(resolve(root, 'packs/ile-de-la-cite-block-1880'), resolve(dest, 'ile-de-la-cite-block-1880'), { recursive: true, force: true });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [copyPacksPlugin()],
  build: {
    outDir: 'dist',
    target: 'es2021',
    sourcemap: false,
  },
  server: { port: 5173 },
});
