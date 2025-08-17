import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
// https://mmazzarolo.com/blog/2024-08-13-async-chunk-preloading-on-load/
import { pluginChunksPreload } from './src/plugin/router-chunk-mapping';

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
  plugins: [pluginReact(), pluginChunksPreload()],
  // This is only affect in dev mode :(
  // performance: {
  //   preload: {
  //     type: 'async-chunks',
  //     include: [/\.png$/],
  //   },
  // },
});
