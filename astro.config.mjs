// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Production: custom domain (also add DNS + GitHub Pages custom domain settings).
export default defineConfig({
  site: 'https://apriljzhang.com',
  vite: {
    plugins: [tailwindcss()]
  }
});