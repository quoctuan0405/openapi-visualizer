import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    title: 'OpenAPI / Swagger visualizer',
    meta: ({ value }) => {
      value.description =
        'Easily visualize complex OpenAPI / Swagger API structure';
      value.keywords = 'OpenAPI, Swagger, visualizer, API structure';
    },
    favicon: './public/favicon.ico',
  },
  plugins: [pluginReact()],
  performance: {
    preload: {
      type: 'async-chunks',
      include: [/\.png$/],
    },
  },
});
