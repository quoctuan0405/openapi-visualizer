import { memo, useCallback, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { setFocusSide } from '../store/focusSide';
import {
  store as selectedItemStore,
  setSelectedComponentLeft,
  setSelectedPathLeft,
} from '../store/selectedItem';
import {
  store as sidebarLeftStore,
  toggleIsShow,
} from '../store/sidebar/sidebarLeft';
import type { Store as YamlFileStore } from '../store/yamlFile/type-and-utils';
import {
  setFileContent,
  store as yamlFileLeftStore,
} from '../store/yamlFile/yamlFileLeft';
import { Sidebar } from './sidebar';

export const SidebarLeft: React.FC = memo(() => {
  const selectedItemSnap = useSnapshot(selectedItemStore);
  const sidebarLeftSnap = useSnapshot(sidebarLeftStore);
  const yamlFileLeftSnap = useSnapshot(yamlFileLeftStore) as YamlFileStore;

  const paths = useMemo(
    () => Object.keys(yamlFileLeftSnap.pathsTree || {}),
    [yamlFileLeftSnap.pathsTree],
  );

  const componentNames = useMemo(
    () => Object.keys(yamlFileLeftSnap.components || {}),
    [yamlFileLeftSnap],
  );

  const onClick = useCallback(() => {
    setFocusSide('left');
  }, []);

  return (
    <Sidebar
      mode={sidebarLeftSnap.mode}
      fileName={yamlFileLeftSnap.fileName}
      onFileDrop={setFileContent}
      paths={paths}
      selectedPath={selectedItemSnap.value.selectedPathLeft}
      onPathSelected={setSelectedPathLeft}
      componentNames={componentNames}
      selectedComponent={selectedItemSnap.value.selectedComponentNameLeft}
      onComponentSelected={setSelectedComponentLeft}
      onHideSidebar={toggleIsShow}
      onClick={onClick}
    />
  );
});
