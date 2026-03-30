// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
// Production: custom domain (also add DNS + GitHub Pages custom domain settings).
export default defineConfig({
  site: 'https://apriljzhang.com',
  /** Consistent URLs on static hosts (e.g. GitHub Pages) and fewer mixed-slash edge cases. */
  trailingSlash: 'always',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});