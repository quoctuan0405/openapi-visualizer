import { DialogTitle } from '@radix-ui/react-dialog';
import { FaGithub } from 'react-icons/fa';
import { FiCode } from 'react-icons/fi';
import { PiPathBold, PiTreeStructureFill } from 'react-icons/pi';
import { useSnapshot } from 'valtio';
import { cn } from '../lib/cn';
import { store as darkModeStore } from '../store/darkmode';
import { DropYamlFile } from './drop-yaml-file';
import { IconButton } from './icon-button';
import { ItemList } from './item-list';

export const HelpModal: React.FC = () => {
  const { isDarkMode } = useSnapshot(darkModeStore);

  return (
    <div>
      <img
        className="rounded-lg mt-4 w-full"
        src={cn({
          '/screenshot-light.png': !isDarkMode,
          '/screenshot-dark.png': isDarkMode,
        })}
        alt="Screenshot"
      />

      <div className="flex flex-row flex-wrap justify-center mt-4 pb-2 border-b-2">
        <DialogTitle className="flex-1 text-center text-blue-500 dark:text-neutral-300 text-2xl font-semibold mt-1.5">
          Easily visualize complex OpenAPI / Swagger API structure
        </DialogTitle>
        <a
          target="_blank"
          href="https://github.com/quoctuan0405/openapi-visualizer"
          rel="noopener"
        >
          <IconButton tooltip="View source code on Github">
            <FaGithub className="text-2xl" />
          </IconButton>
        </a>
      </div>

      <p className="mt-5 text-neutral-500 dark:text-neutral-300">
        Have you ever had to compare two{' '}
        <span className="font-semibold">massive</span> OpenAPI files, each with
        5,000 lines? I have - and that's why I created this tool.
      </p>

      <div className="mt-4 text-neutral-500 dark:text-neutral-300">
        <p className="text-lg font-semibold">Features</p>
        <ul className="mt-2 pl-6 list-disc space-y-2">
          <li>View API request along with all its referenced objects</li>
          <li>Find all API requests where a reference object is used</li>
          <li>Compare 2 API requests from different files together</li>
          <li>View yaml definition and visualization side by side</li>
        </ul>
      </div>

      <div className="flex flex-row flex-wrap items-stretch gap-5 mt-5">
        <div className="flex-1 flex flex-col flex-wrap">
          <div className="flex-1 flex items-center">
            <img
              className="rounded-lg mt-4"
              src={cn({
                '/api-with-ref-objects-light.png': !isDarkMode,
                '/api-with-ref-objects-dark.png': isDarkMode,
              })}
              alt="View API request along with all its reference objects"
            />
          </div>

          <p className="mt-2 text-sm italic text-neutral-500 dark:text-neutral-400 text-center">
            View API request along with all its reference objects
          </p>
        </div>

        <div className="flex-1 flex flex-col flex-wrap">
          <div className="flex-1 flex items-center">
            <img
              className="rounded-lg mt-4"
              src={cn({
                '/obj-tracing-light.png': !isDarkMode,
                '/obj-tracing-dark.png': isDarkMode,
              })}
              alt="Trace a ref object to its root"
            />
          </div>

          <p className="mt-2 text-sm italic text-neutral-500 dark:text-neutral-400 text-center">
            Trace a ref object to its root
          </p>
        </div>

        <div className="flex-[2] flex flex-col flex-wrap">
          <div className="flex-1 flex items-center">
            <img
              className="rounded-lg mt-4"
              src={cn({
                '/path-comparer-light.png': !isDarkMode,
                '/path-comparer-dark.png': isDarkMode,
              })}
              alt="Compare 2 API requests from different files together"
            />
          </div>

          <p className=" text-sm italic text-neutral-500 dark:text-neutral-400 text-center">
            Compare 2 API requests from different files together
          </p>
        </div>

        <div className="flex-1 flex flex-col flex-wrap">
          <div className="flex-1 flex items-center">
            <img
              className="rounded-lg mt-4"
              src={cn({
                '/view-code-side-by-side-light.png': !isDarkMode,
                '/view-code-side-by-side-dark.png': isDarkMode,
              })}
              alt="View yaml definition and visualization side by side"
            />
          </div>

          <p className="mt-2 text-sm italic text-neutral-500 dark:text-neutral-400 text-center">
            View yaml definition and visualization side by side
          </p>
        </div>
      </div>

      <div className="mt-6 text-neutral-500 dark:text-neutral-300">
        <p className="text-lg font-semibold">Guides</p>

        <p className="text-blue-500 mt-3 font-semibold">View an API request</p>
        <img
          className="rounded-lg mt-4"
          src={cn({
            '/api-with-ref-objects-light.png': !isDarkMode,
            '/api-with-ref-objects-dark.png': isDarkMode,
          })}
          alt="View yaml definition and visualization side by side"
        />
        <ul className="mt-2 pl-6 list-disc space-y-5">
          <li>
            <div className="flex flex-col flex-wrap gap-5">
              <p>
                Drop your OpenAPI or Swagger file into this box on the sidebar{' '}
                <span className="text-neutral-400">
                  (Don't have one? Try{' '}
                  <a
                    className="underline"
                    href="/complex-openAPI.yaml"
                    download
                  >
                    this file
                  </a>
                  )
                </span>
              </p>
              <DropYamlFile className="w-[250px]" disabled />
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-2">
              <p>Then choose a path</p>
              <div className="w-[250px]">
                <ItemList
                  placeholder="Search path"
                  items={['/path 1', '/path 2', '/path 3']}
                />
              </div>
            </div>
          </li>
        </ul>

        <p className="text-blue-500 mt-5 font-semibold">
          Trace a reference object to its root
        </p>
        <img
          className="rounded-lg mt-4"
          src={cn({
            '/obj-tracing-light.png': !isDarkMode,
            '/obj-tracing-dark.png': isDarkMode,
          })}
          alt="Trace a ref object to its root"
        />
        <ul className="mt-2 pl-6 list-disc space-y-5">
          <li>
            <div className="flex flex-col flex-wrap gap-5">
              <p>
                Drop your OpenAPI or Swagger file into this box on the sidebar{' '}
                <span className="text-neutral-400">
                  (Don't have one? Try{' '}
                  <a
                    className="underline"
                    href="/complex-openAPI.yaml"
                    download
                  >
                    this file
                  </a>
                  )
                </span>
              </p>
              <DropYamlFile className="w-[250px]" disabled />
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-2">
              <p>Then choose Object Tracing (or press Ctrl + Shift + G)</p>
              <div className="flex flex-col flex-wrap bg-white dark:bg-neutral-950 py-5 w-max">
                <IconButton
                  tooltip="Path viewer (Ctrl + Shift + E)"
                  tooltipPosition="right"
                >
                  <PiTreeStructureFill className="text-3xl" />
                </IconButton>
                <IconButton
                  tooltip="Object Tracing (Ctrl + Shift + G)"
                  tooltipPosition="right"
                  selected
                >
                  <PiPathBold className="text-2xl m-1" />
                </IconButton>
                <IconButton
                  tooltip="View code (Ctrl + Shift + X)"
                  tooltipPosition="right"
                >
                  <FiCode className="text-2xl m-1" />
                </IconButton>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-2">
              <p>Next, choose a reference object</p>
              <div className="w-[250px]">
                <ItemList
                  placeholder="Search path"
                  items={['Item', 'User', 'UserRole']}
                />
              </div>
            </div>
          </li>
        </ul>

        <p className="text-blue-500 mt-5 font-semibold">
          Compare 2 API requests from different files together
        </p>
        <img
          className="rounded-lg mt-4"
          src={cn({
            '/path-comparer-light.png': !isDarkMode,
            '/path-comparer-dark.png': isDarkMode,
          })}
          alt="View yaml definition and visualization side by side"
        />
        <ul className="mt-2 pl-6 list-disc space-y-5">
          <li>
            <div className="flex flex-col flex-wrap gap-5">
              <p>
                On the left sidebar, drop your OpenAPI or Swagger file into this
                box{' '}
                <span className="text-neutral-400">
                  (Don't have one? Try{' '}
                  <a
                    className="underline"
                    href="/complex-openAPI.yaml"
                    download
                  >
                    this file
                  </a>
                  )
                </span>
              </p>

              <div className="flex flex-row flex-wrap gap-3">
                <div className="flex flex-col flex-wrap bg-white dark:bg-neutral-950 py-5 w-max">
                  <IconButton
                    tooltip="Path viewer (Ctrl + Shift + E)"
                    tooltipPosition="right"
                  >
                    <PiTreeStructureFill className="text-3xl" />
                  </IconButton>
                  <IconButton
                    tooltip="Object Tracing (Ctrl + Shift + G)"
                    tooltipPosition="right"
                  >
                    <PiPathBold className="text-2xl m-1" />
                  </IconButton>
                  <IconButton
                    tooltip="View code (Ctrl + Shift + X)"
                    tooltipPosition="right"
                  >
                    <FiCode className="text-2xl m-1" />
                  </IconButton>
                </div>
                <DropYamlFile className="w-[250px]" disabled />
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-2">
              <p>Next, choose a path</p>
              <div className="w-[250px]">
                <ItemList
                  placeholder="Search path"
                  items={['/path 1', '/path 2', '/path 3']}
                />
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-5">
              <p>
                On the right sidebar, drop your OpenAPI or Swagger file into
                this box{' '}
                <span className="text-neutral-400">
                  (Don't have one? Try{' '}
                  <a
                    className="underline"
                    href="/complex-openAPI.yaml"
                    download
                  >
                    this file
                  </a>
                  )
                </span>
              </p>

              <div className="flex flex-row flex-wrap gap-3">
                <DropYamlFile className="w-[250px]" disabled />
                <div className="flex flex-col flex-wrap bg-white dark:bg-neutral-950 py-5 w-max">
                  <IconButton
                    tooltip="Path viewer (Ctrl + Shift + E)"
                    tooltipPosition="right"
                  >
                    <PiTreeStructureFill className="text-3xl" />
                  </IconButton>
                  <IconButton
                    tooltip="Object Tracing (Ctrl + Shift + G)"
                    tooltipPosition="right"
                  >
                    <PiPathBold className="text-2xl m-1" />
                  </IconButton>
                  <IconButton
                    tooltip="View code (Ctrl + Shift + X)"
                    tooltipPosition="right"
                  >
                    <FiCode className="text-2xl m-1" />
                  </IconButton>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-2">
              <p>Next, choose a path</p>
              <div className="w-[250px]">
                <ItemList
                  placeholder="Search path"
                  items={['/path 1', '/path 2', '/path 3']}
                />
              </div>
            </div>
          </li>
        </ul>

        <p className="text-blue-500 mt-5 font-semibold">
          View yaml definition and visualization side by side
        </p>
        <img
          className="rounded-lg mb-7"
          src={cn({
            '/view-code-side-by-side-light.png': !isDarkMode,
            '/view-code-side-by-side-dark.png': isDarkMode,
          })}
          alt="View yaml definition and visualization side by side"
        />
        <ul className="mt-2 pl-6 list-disc space-y-5">
          <li>
            <div className="flex flex-col flex-wrap gap-5">
              <p>
                Drop your OpenAPI or Swagger file into this box on the sidebar{' '}
                <span className="text-neutral-400">
                  (Don't have one? Try{' '}
                  <a
                    className="underline"
                    href="/complex-openAPI.yaml"
                    download
                  >
                    this file
                  </a>
                  )
                </span>
              </p>
              <DropYamlFile className="w-[250px]" disabled />
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-2">
              <p>Then choose View code (or press Ctrl + Shift + X)</p>
              <div className="flex flex-col flex-wrap bg-white dark:bg-neutral-950 py-5 w-max">
                <IconButton
                  tooltip="Path viewer (Ctrl + Shift + E)"
                  tooltipPosition="right"
                >
                  <PiTreeStructureFill className="text-3xl" />
                </IconButton>
                <IconButton
                  tooltip="Object Tracing (Ctrl + Shift + G)"
                  tooltipPosition="right"
                >
                  <PiPathBold className="text-2xl m-1" />
                </IconButton>
                <IconButton
                  tooltip="View code (Ctrl + Shift + X)"
                  tooltipPosition="right"
                  selected
                >
                  <FiCode className="text-2xl m-1" />
                </IconButton>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-2">
              <p>Next, choose a path</p>
              <div className="w-[250px]">
                <ItemList
                  placeholder="Search path"
                  items={['/path 1', '/path 2', '/path 3']}
                />
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className="mt-6 text-neutral-500 dark:text-neutral-300">
        <p className="font-semibold">Tips</p>
        <ul className="mt-1.5 pl-6 list-disc space-y-2">
          <li>
            <div className="flex flex-col flex-wrap gap-5">
              <p>
                Ctrl + Hover on the title of component node to find which paths
                use this object
              </p>
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-5">
              <p>
                Ctrl + Click on the title of component node to go to that
                component
              </p>
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-5">
              <p>Ctrl + B to close sidebar</p>
            </div>
          </li>
          <li>
            <div className="flex flex-col flex-wrap gap-5">
              <p>
                Ctrl + Z and Ctrl + Shift + Z to go back and forth on your
                selected component and path
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HelpModal;
