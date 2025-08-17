// https://mmazzarolo.com/blog/2024-08-13-async-chunk-preloading-on-load/
import type { RsbuildPlugin } from '@rsbuild/core';

type PathToFilesToPreloadMapping = {
  pngs: string[];
  scripts: string[];
};

export const pluginChunksPreload = (): RsbuildPlugin => ({
  name: 'plugin-chunks-preload',
  setup: (api) => {
    api.processAssets(
      { stage: 'report' },
      ({ assets, sources, compilation }) => {
        // You know what me import ALL!!!!
        const pathToFilePreload: PathToFilesToPreloadMapping = {
          pngs: [
            'screenshot-light.png',
            'screenshot-dark.png',
            'api-with-ref-objects-light.png',
            'api-with-ref-objects-dark.png',
            'obj-tracing-light.png',
            'obj-tracing-dark.png',
            'path-comparer-light.png',
            'path-comparer-dark.png',
            'view-code-side-by-side-light.png',
            'view-code-side-by-side-dark.png',
          ],
          scripts: [],
        };

        for (const chunkGroup of compilation.chunkGroups) {
          // I don't know why all async chunk group has its name is undefined
          if (chunkGroup.name === undefined) {
            const chunkFiles = chunkGroup
              .getFiles()
              .filter((file) => file.endsWith('.js'));
            pathToFilePreload.scripts.push(...chunkFiles);
          }
        }

        // Generate the (stringified) script responsible for preloading the
        // async chunk files (based on the current URL).
        const scriptToInject = generatePreloadScriptToInject(pathToFilePreload);

        // Insert the generated script into the index.html's <head>, right
        // before any other script.
        const indexHTML = assets['index.html'];
        if (!indexHTML) {
          return;
        }
        const oldIndexHTMLContent = indexHTML.source();
        const firstScriptInIndexHTMLIndex =
          oldIndexHTMLContent.indexOf('<script');
        const newIndexHTMLContent = `${oldIndexHTMLContent.slice(
          0,
          firstScriptInIndexHTMLIndex,
        )}${scriptToInject}${oldIndexHTMLContent.slice(
          firstScriptInIndexHTMLIndex,
        )}`;
        const source = new sources.RawSource(newIndexHTMLContent);
        compilation.updateAsset('index.html', source);
      },
    );
  },
});

// Generate the script to inject in the HTML.
// It checks what the current URL is and adds preload links of each file of
// the chunk associated with the URL.
const generatePreloadScriptToInject = (
  pathToFilesToPreloadMapping: PathToFilesToPreloadMapping,
): string => {
  const scriptContent = `
	  try {
      (function () {
        const scriptsToPreload = ${JSON.stringify(pathToFilesToPreloadMapping.scripts)};
        if (scriptsToPreload) {
            for (const fileToPreload of scriptsToPreload) {
              const preloadLinkEl = document.createElement("link");
                        preloadLinkEl.setAttribute("href", fileToPreload);
                        preloadLinkEl.setAttribute("rel", "preload");
                        preloadLinkEl.setAttribute("as", "script");
                        document.head.appendChild(preloadLinkEl);
            }
        }

        const pngsToPreload = ${JSON.stringify(pathToFilesToPreloadMapping.pngs)};
        if (pngsToPreload) {
            for (const pngToPreload of pngsToPreload) {
              const preloadLinkEl = document.createElement("link");
                        preloadLinkEl.setAttribute("href", pngToPreload);
                        preloadLinkEl.setAttribute("rel", "preload");
                        preloadLinkEl.setAttribute("as", "image");
                        document.head.appendChild(preloadLinkEl);
            }
        }
      })();
    } catch (err) {
      console.warn("Unable to run the scripts preloading.");	
    }
`;
  const script = `<script>${scriptContent}</script>`;

  return script;
};
