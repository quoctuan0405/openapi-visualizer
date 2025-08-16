import { Panel } from '@xyflow/react';
import { useHotkeys } from 'react-hotkeys-hook';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useSnapshot } from 'valtio';
import { store as selectedItemStore } from '../store/selectedItem';
import { IconButton } from './icon-button';

export const UndoRedoPanel: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useSnapshot(selectedItemStore);

  useHotkeys('Ctrl + Z', () => {
    undo();
  });

  useHotkeys('Ctrl + Shift + Z', () => {
    redo();
  });

  return (
    <Panel position="top-left">
      <IconButton
        className="rounded-full"
        disabled={!canUndo()}
        tooltip="Undo (Ctrl + Z)"
        tooltipPosition="bottom"
        onClick={undo}
      >
        <IoIosArrowBack className="text-2xl" />
      </IconButton>
      <IconButton
        className="rounded-full"
        disabled={!canRedo()}
        tooltip="Redo (Ctrl + Shift + Z)"
        tooltipPosition="bottom"
        onClick={redo}
      >
        <IoIosArrowForward className="text-2xl" />
      </IconButton>
    </Panel>
  );
};
