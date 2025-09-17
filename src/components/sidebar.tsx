import { memo } from 'react';
import { FaWindowMinimize } from 'react-icons/fa';
import type { Mode } from '../store/sidebar/type';
import { DropYamlFile } from './drop-yaml-file';
import { IconButton } from './icon-button';
import { ItemList } from './item-list';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

type Props = {
  mode: Mode;
  fileName?: string;
  onFileDrop?: (fileName: string, fileContent: string) => void;
  paths: string[];
  selectedPath?: string;
  onPathSelected: (path: string) => void;
  componentNames: string[];
  missingComponentNames: string[];
  selectedComponent?: string;
  onComponentSelected: (componentName: string) => void;
  onHideSidebar?: () => void;
  onClick?: () => void; // For setting focus side (left or right)
};

export const Sidebar: React.FC<Props> = memo(
  ({
    mode,
    fileName,
    onFileDrop,
    paths,
    selectedPath,
    onPathSelected,
    componentNames,
    missingComponentNames,
    selectedComponent,
    onComponentSelected,
    onHideSidebar,
    onClick, // For focus
  }) => {
    return (
      <ResizablePanelGroup
        direction="vertical"
        className="relative bg-white/30 dark:bg-neutral-900 backdrop-blur-2xl"
        onClick={onClick}
      >
        <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 duration-200">
          <IconButton
            className="rounded-lg"
            tooltip="Hide sidebar (Ctrl + B)"
            onClick={onHideSidebar}
          >
            <FaWindowMinimize className="text-lg mb-1.5 -mt-1.5" />
          </IconButton>
        </div>

        <ResizablePanel
          id="drop-file"
          className="border-b-2 -mb-1 p-5"
          order={1}
        >
          <DropYamlFile fileName={fileName} onFileDrop={onFileDrop} />
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel
          id="path-object-searcher"
          className="!overflow-y-scroll dark:scrollbar dark:scrollbar-thumb-neutral-800 dark:scrollbar-track-neutral-900"
          order={2}
        >
          <div className="p-5">
            {/* Path viewer */}
            {mode === 'path-viewer' && (
              <ItemList
                placeholder="Search path"
                selectedItem={selectedPath}
                items={paths}
                onSelectItem={onPathSelected}
              />
            )}

            {/* Object tracing */}
            {mode === 'object-tracing' && (
              <ItemList
                placeholder="Search component"
                selectedItem={selectedComponent}
                items={componentNames}
                onSelectItem={onComponentSelected}
              />
            )}

            {/* Code viewer */}
            {mode === 'code-viewer' && !selectedComponent && (
              <ItemList
                placeholder="Search path"
                selectedItem={selectedPath}
                items={paths}
                onSelectItem={onPathSelected}
              />
            )}

            {mode === 'code-viewer' && selectedComponent && (
              <ItemList
                placeholder="Search component"
                selectedItem={selectedComponent}
                items={componentNames}
                onSelectItem={onComponentSelected}
              />
            )}

            {/* Missing refs */}
            {mode === 'missing-refs' && (
              <ItemList
                placeholder="Search missing components"
                selectedItem={selectedComponent}
                items={missingComponentNames}
                onSelectItem={onComponentSelected}
              />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  },
);
