import { lazy, memo, useDeferredValue, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { stringify } from 'yaml';
import { store as selectedItemStore } from '../store/selectedItem';
import type { Store as YamlFileStore } from '../store/yamlFile/type-and-utils';
import { store as yamlFileLeftStore } from '../store/yamlFile/yamlFileLeft';
import type { Response } from './code-panel';

const CodePanel = lazy(() => import('./code-panel'));

export const CodePanelLeft: React.FC = memo(() => {
  const yamlFileLeftSnap = useSnapshot(yamlFileLeftStore) as YamlFileStore;
  const selectedItemSnap = useSnapshot(selectedItemStore);

  // Path tree
  const pathsTree = useMemo(() => {
    if (yamlFileLeftSnap.pathsTree && selectedItemSnap.value.selectedPathLeft) {
      return yamlFileLeftSnap.pathsTree[
        selectedItemSnap.value.selectedPathLeft
      ];
    }
  }, [yamlFileLeftSnap.pathsTree, selectedItemSnap.value.selectedPathLeft]);
  const deferredPathTree = useDeferredValue(pathsTree);

  // Path definition
  const pathDefinition = useMemo(() => {
    if (deferredPathTree) {
      return stringify({
        [deferredPathTree.path]: deferredPathTree.rawDefinition,
      });
    }
  }, [deferredPathTree]);
  const deferredPathDefinition = useDeferredValue(pathDefinition);

  // Request body
  const requestBodyRefs = useMemo(() => {
    let requestBodyRefs: object = {};
    deferredPathTree?.requestBody?.flattenRefs.forEach((refObject) => {
      requestBodyRefs = { ...requestBodyRefs, ...refObject.rawDefinition };
    });

    return stringify(requestBodyRefs);
  }, [deferredPathTree]);
  const deferredRequestBodyRefs = useDeferredValue(requestBodyRefs);

  // Responses
  const responses: Response[] = useMemo(() => {
    if (!deferredPathTree?.responses) {
      return [];
    }

    const responses: Response[] = [];
    for (const response of deferredPathTree.responses) {
      let responseRefs: object = {};
      response.flattenRefs.forEach((refObject) => {
        responseRefs = { ...responseRefs, ...refObject.rawDefinition };
      });

      responses.push({
        status: response.status,
        rawDefinition: stringify(responseRefs),
      });
    }

    return responses;
  }, [deferredPathTree]);
  const deferredResponses = useDeferredValue(responses);

  return (
    <CodePanel
      pathDefinition={deferredPathDefinition}
      requestBodyRefsDefinition={deferredRequestBodyRefs}
      responses={deferredResponses}
    />
  );
});
