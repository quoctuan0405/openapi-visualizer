import { lazy, memo } from 'react';
import { useSnapshot } from 'valtio';
import { store as selectedItemStore } from '../store/selectedItem';
import type { Store as YamlFileStore } from '../store/yamlFile/type-and-utils';
import { store as yamlFileRightStore } from '../store/yamlFile/yamlFileRight';

const CodePanel = lazy(() => import('./code-panel'));

export const CodePanelRight: React.FC = memo(() => {
  const yamlFileRightSnap = useSnapshot(yamlFileRightStore) as YamlFileStore;
  const selectedItemSnap = useSnapshot(selectedItemStore);

  return (
    <CodePanel
      pathsTree={yamlFileRightSnap.pathsTree}
      components={yamlFileRightSnap.components}
      selectedComponent={selectedItemSnap.value.selectedComponentNameRight}
      selectedPath={selectedItemSnap.value.selectedPathRight}
    />
  );
});
