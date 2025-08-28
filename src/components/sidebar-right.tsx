import { memo, useCallback, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { setFocusSide } from '../store/focusSide';
import {
  store as selectedItemStore,
  setSelectedComponentRight,
  setSelectedPathRight,
} from '../store/selectedItem';
import {
  store as sidebarRightStore,
  toggleIsShow,
} from '../store/sidebar/sidebarRight';
import type { Store as YamlFileStore } from '../store/yamlFile/type-and-utils';
import {
  setFileContent,
  store as yamlFileRightStore,
} from '../store/yamlFile/yamlFileRight';
import { Sidebar } from './sidebar';

export const SidebarRight: React.FC = memo(() => {
  const selectedItemSnap = useSnapshot(selectedItemStore);
  const sidebarRightSnap = useSnapshot(sidebarRightStore);
  const yamlFileRightSnap = useSnapshot(yamlFileRightStore) as YamlFileStore;

  const paths = useMemo(
    () => Object.keys(yamlFileRightSnap.pathsTree || {}),
    [yamlFileRightSnap.pathsTree],
  );

  const componentNames = useMemo(
    () => Object.keys(yamlFileRightSnap.components || {}),
    [yamlFileRightSnap],
  );

  const missingComponentNames = useMemo(
    () => Object.keys(yamlFileRightSnap.missingRefComponents || {}),
    [yamlFileRightSnap],
  );

  const onClick = useCallback(() => {
    setFocusSide('right');
  }, []);

  return (
    <Sidebar
      mode={sidebarRightSnap.mode}
      fileName={yamlFileRightSnap.fileName}
      onFileDrop={setFileContent}
      paths={paths}
      selectedPath={selectedItemSnap.value.selectedPathRight}
      onPathSelected={setSelectedPathRight}
      componentNames={componentNames}
      missingComponentNames={missingComponentNames}
      selectedComponent={selectedItemSnap.value.selectedComponentNameRight}
      onComponentSelected={setSelectedComponentRight}
      onHideSidebar={toggleIsShow}
      onClick={onClick}
    />
  );
});
