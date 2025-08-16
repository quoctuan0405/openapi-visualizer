import { memo, useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { store as focusSideStore, setFocusSide } from '../store/focusSide';
import {
  setMode,
  store as sidebarLeftStore,
} from '../store/sidebar/sidebarLeft';
import { ActivityBar } from './activity-bar';

export const ActivityBarLeft: React.FC = memo(() => {
  const { mode } = useSnapshot(sidebarLeftStore);
  const { focusSide } = useSnapshot(focusSideStore);

  const onChoosePathViewer = useCallback(() => {
    setMode('path-viewer');
  }, []);

  const onChooseObjectTracing = useCallback(() => {
    setMode('object-tracing');
  }, []);

  const onChooseCodeViewer = useCallback(() => {
    setMode('code-viewer');
  }, []);

  const onClick = useCallback(() => {
    setFocusSide('left');
  }, []);

  return (
    <ActivityBar
      mode={mode}
      isActivateShortcut={focusSide === 'left'}
      onChoosePathViewer={onChoosePathViewer}
      onChooseObjectTracing={onChooseObjectTracing}
      onChooseCodeViewer={onChooseCodeViewer}
      onClick={onClick}
    />
  );
});
