import { memo, useCallback, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { store as focusSideStore, setFocusSide } from '../store/focusSide';
import {
  setMode,
  store as sidebarRightStore,
} from '../store/sidebar/sidebarRight';
import { store as yamlFileRightStore } from '../store/yamlFile/yamlFileRight';
import { ActivityBar } from './activity-bar';

export const ActivityBarRight: React.FC = memo(() => {
  const { mode } = useSnapshot(sidebarRightStore);
  const { focusSide } = useSnapshot(focusSideStore);
  const { missingRefComponents } = useSnapshot(yamlFileRightStore);

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

  const numberOfMissingRefs = useMemo(() => {
    return missingRefComponents ? Object.keys(missingRefComponents).length : 0;
  }, [missingRefComponents]);

  return (
    <ActivityBar
      mode={mode}
      isActivateShortcut={focusSide === 'right'}
      onChoosePathViewer={onChoosePathViewer}
      onChooseObjectTracing={onChooseObjectTracing}
      onChooseCodeViewer={onChooseCodeViewer}
      onChooseMissingRefs={onChooseMissingRefs}
      numberOfMissingRefs={numberOfMissingRefs}
      onClick={onClick}
    />
  );
});
