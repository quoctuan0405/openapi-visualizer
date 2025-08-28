import { memo, useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { store as focusSideStore, setFocusSide } from '../store/focusSide';
import {
  setMode,
  store as sidebarRightStore,
} from '../store/sidebar/sidebarRight';
import { ActivityBar } from './activity-bar';

export const ActivityBarRight: React.FC = memo(() => {
  const { mode } = useSnapshot(sidebarRightStore);
  const { focusSide } = useSnapshot(focusSideStore);

  const onChooseCodeViewer = useCallback(() => {
    setMode('code-viewer');
  }, []);

  const onChoosePathViewer = useCallback(() => {
    setMode('path-viewer');
  }, []);

  const onChooseObjectTracing = useCallback(() => {
    setMode('object-tracing');
  }, []);

  const onChooseMissingRefs = useCallback(() => {
    setMode('missing-refs');
  }, []);

  const onClick = useCallback(() => {
    setFocusSide('right');
  }, []);

  return (
    <ActivityBar
      mode={mode}
      isActivateShortcut={focusSide === 'right'}
      onChoosePathViewer={onChoosePathViewer}
      onChooseObjectTracing={onChooseObjectTracing}
      onChooseCodeViewer={onChooseCodeViewer}
      onChooseMissingRefs={onChooseMissingRefs}
      onClick={onClick}
    />
  );
});
