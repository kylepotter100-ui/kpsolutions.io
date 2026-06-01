// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://kpsolutions.io',
  output: 'server',
  adapter: cloudflare(),
  // compat aliases react/react-dom -> preact/compat so the form stays a
  // React-style island while shipping ~10KB instead of React's ~58KB.
  // sitemap emits sitemap-index.xml for the prerendered marketing routes.
  integrations: [preact({ compat: true }), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
