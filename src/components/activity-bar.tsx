import { lazy, memo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaInfoCircle } from 'react-icons/fa';
import { FiCode } from 'react-icons/fi';
import { MdDarkMode } from 'react-icons/md';
import { PiPathBold, PiTreeStructureFill, PiWarningFill } from 'react-icons/pi';
import { cn } from '../lib/cn';
import { toggleDarkMode } from '../store/darkmode';
import type { Mode } from '../store/sidebar/type';
import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { IconButton } from './icon-button';

const HelpModal = lazy(() => import('./help-modal'));

type Props = {
  mode?: Mode;
  isActivateShortcut?: boolean;
  onChoosePathViewer?: () => void;
  onChooseObjectTracing?: () => void;
  onChooseCodeViewer?: () => void;
  onChooseMissingRefs?: () => void;
  numberOfMissingRefs?: number;
  onClick?: () => void; // For setting focus side (left or right)
};

export const ActivityBar: React.FC<Props> = memo(
  ({
    mode,
    isActivateShortcut,
    onChoosePathViewer,
    onChooseObjectTracing,
    onChooseCodeViewer,
    onChooseMissingRefs,
    numberOfMissingRefs,
    onClick,
  }) => {
    useHotkeys('Ctrl + Shift + E', (e) => {
      e.preventDefault();
      isActivateShortcut && onChoosePathViewer?.();
    });

    useHotkeys('Ctrl + Shift + G', (e) => {
      e.preventDefault();
      isActivateShortcut && onChooseObjectTracing?.();
    });

    useHotkeys('Ctrl + Shift + X', (e) => {
      e.preventDefault();
      isActivateShortcut && onChooseCodeViewer?.();
    });

    useHotkeys('Ctrl + E', (e) => {
      e.preventDefault();
      isActivateShortcut && onChooseMissingRefs?.();
    });

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: it's ok to attach onClick to a div here
      <div
        className="flex flex-col flex-wrap bg-white dark:bg-neutral-950 py-5 w-max h-screen"
        onClick={onClick} // For setting focus side (left or right)
        onKeyDown={onClick}
      >
        <IconButton
          tooltip="Path viewer (Ctrl + Shift + E)"
          tooltipPosition="right"
          selected={mode === 'path-viewer'}
          onClick={onChoosePathViewer}
        >
          <PiTreeStructureFill className="text-3xl" />
        </IconButton>
        <IconButton
          tooltip="Object Tracing (Ctrl + Shift + G)"
          tooltipPosition="right"
          selected={mode === 'object-tracing'}
          onClick={onChooseObjectTracing}
        >
          <PiPathBold className="text-2xl m-1" />
        </IconButton>
        <IconButton
          tooltip="View code (Ctrl + Shift + X)"
          tooltipPosition="right"
          selected={mode === 'code-viewer'}
          onClick={onChooseCodeViewer}
        >
          <FiCode className="text-2xl m-1" />
        </IconButton>
        <IconButton
          tooltip="View missing ref components (Ctrl + E)"
          tooltipPosition="right"
          selected={mode === 'missing-refs'}
          onClick={onChooseMissingRefs}
        >
          {numberOfMissingRefs ? (
            <div
              className={cn(
                'absolute -top-1 -right-1 flex flex-wrap items-center justify-center font-semibold text-xs size-5 rounded-full dark:text-neutral-400 duration-500',
                {
                  'bg-blue-200 dark:bg-neutral-700': mode === 'missing-refs',
                  'bg-neutral-200 dark:bg-neutral-800': mode !== 'missing-refs',
                },
              )}
            >
              {numberOfMissingRefs}
            </div>
          ) : undefined}

          <PiWarningFill className="text-2xl m-1" />
        </IconButton>

        <div className="flex-1"></div>

        <Dialog>
          <DialogTrigger asChild>
            <IconButton tooltip="Help" tooltipPosition="right">
              <FaInfoCircle className="text-2xl m-1" />
            </IconButton>
          </DialogTrigger>
          <DialogContent className="dark:scrollbar dark:scrollbar-thumb-neutral-800 dark:scrollbar-track-neutral-900">
            <HelpModal />
          </DialogContent>
        </Dialog>
        <IconButton
          tooltip="Toggle dark mode"
          tooltipPosition="right"
          onClick={toggleDarkMode}
        >
          <MdDarkMode className="text-3xl" />
        </IconButton>
      </div>
    );
  },
);
