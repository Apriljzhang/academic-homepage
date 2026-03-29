// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Project site: https://apriljzhang.github.io/academic-homepage/
export default defineConfig({
  site: 'https://apriljzhang.github.io',
  base: '/academic-homepage',
  vite: {
    plugins: [tailwindcss()]
  }
});