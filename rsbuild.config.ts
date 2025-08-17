import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
// https://mmazzarolo.com/blog/2024-08-13-async-chunk-preloading-on-load/
import { pluginChunksPreload } from './src/plugin/router-chunk-mapping';

export default defineConfig({
  html: {
    title: 'OpenAPI / Swagger visualizer',
    meta: ({ value }) => {
      value['og:title'] = 'OpenAPI / Swagger visualizer';
      value['twitter:title'] = 'OpenAPI / Swagger visualizer';
      value.description =
        'Easily visualize complex OpenAPI / Swagger API structure';
      value['og:description'] =
        'Easily visualize complex OpenAPI / Swagger API structure';
      value['twitter:description'] =
        'Easily visualize complex OpenAPI / Swagger API structure';
      value.keywords = 'OpenAPI, Swagger, visualizer, API structure';
      value['og:image'] = 'https://openapi-visualizer.vercel.app/og-image.png';
      value['twitter:image'] =
        'https://openapi-visualizer.vercel.app/og-image.png';
      value['og:url'] = 'https://openapi-visualizer.vercel.app/';
      value['og:type'] = 'website';
    },
    favicon: './public/favicon.ico',
    template: './index.html',
  },
  plugins: [pluginReact(), pluginChunksPreload()],
  // This is only affect in dev mode :(
  // performance: {
  //   preload: {
  //     type: 'async-chunks',
  //     include: [/\.png$/],
  //   },
  // },
});
