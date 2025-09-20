import { lazy, memo } from 'react';
import { useSnapshot } from 'valtio';
import { store as selectedItemStore } from '../store/selectedItem';
import type { Store as YamlFileStore } from '../store/yamlFile/type-and-utils';
import { store as yamlFileLeftStore } from '../store/yamlFile/yamlFileLeft';

const CodePanel = lazy(() => import('./code-panel'));

export const CodePanelLeft: React.FC = memo(() => {
  const yamlFileLeftSnap = useSnapshot(yamlFileLeftStore) as YamlFileStore;
  const selectedItemSnap = useSnapshot(selectedItemStore);

  return (
    <CodePanel
      pathsTree={yamlFileLeftSnap.pathsTree}
      components={yamlFileLeftSnap.components}
      selectedComponent={selectedItemSnap.value.selectedComponentNameLeft}
      selectedPath={selectedItemSnap.value.selectedPathLeft}
    />
  );
});
