import { memo, useCallback, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { store as focusSideStore, setFocusSide } from '../store/focusSide';
import {
  setMode,
  store as sidebarLeftStore,
} from '../store/sidebar/sidebarLeft';
import { store as yamlFileLeftStore } from '../store/yamlFile/yamlFileLeft';
import { ActivityBar } from './activity-bar';

export const ActivityBarLeft: React.FC = memo(() => {
  const { mode } = useSnapshot(sidebarLeftStore);
  const { focusSide } = useSnapshot(focusSideStore);
  const { missingRefComponents } = useSnapshot(yamlFileLeftStore);

  const onChoosePathViewer = useCallback(() => {
    setMode('path-viewer');
  }, []);

  const onChooseObjectTracing = useCallback(() => {
    setMode('object-tracing');
  }, []);

  const onChooseCodeViewer = useCallback(() => {
    setMode('code-viewer');
  }, []);

  const onChooseMissingRefs = useCallback(() => {
    setMode('missing-refs');
  }, []);

  const onClick = useCallback(() => {
    setFocusSide('left');
  }, []);

  const numberOfMissingRefs = useMemo(() => {
    return missingRefComponents ? Object.keys(missingRefComponents).length : 0;
  }, [missingRefComponents]);

  return (
    <ActivityBar
      mode={mode}
      isActivateShortcut={focusSide === 'left'}
      onChoosePathViewer={onChoosePathViewer}
      onChooseObjectTracing={onChooseObjectTracing}
      onChooseCodeViewer={onChooseCodeViewer}
      onChooseMissingRefs={onChooseMissingRefs}
      numberOfMissingRefs={numberOfMissingRefs}
      onClick={onClick}
    />
  );
});
