import {
  lazy,
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSnapshot } from 'valtio';
import { stringify } from 'yaml';
import { yieldToMainThread } from '../lib/yieldToMainThread';
import { store as selectedItemStore } from '../store/selectedItem';
import type {
  Response as APIResponse,
  Store as YamlFileStore,
} from '../store/yamlFile/type-and-utils';
import { store as yamlFileLeftStore } from '../store/yamlFile/yamlFileLeft';
import type { Component, Response } from './code-panel';

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

    return undefined;
  }, [yamlFileLeftSnap.pathsTree, selectedItemSnap.value.selectedPathLeft]);

  // Path definition
  const [pathDefinition, setPathDefinition] = useState<string>();

  useEffect(() => {
    if (!pathsTree) {
      setPathDefinition(undefined);
      return;
    }

    startTransition(() => {
      setPathDefinition(
        stringify({
          [pathsTree.path]: pathsTree.rawDefinition,
        }),
      );
    });
  }, [pathsTree]);

  // Request body
  const [requestBodyRefs, setRequestBodyRefs] = useState<string>();
  useEffect(() => {
    if (!pathsTree) {
      setRequestBodyRefs(undefined);
      return;
    }

    let requestBodyRefs: object = {};
    pathsTree.requestBody?.flattenRefs.forEach((refObject) => {
      requestBodyRefs = { ...requestBodyRefs, ...refObject.rawDefinition };
    });

    startTransition(() => {
      setRequestBodyRefs(stringify(requestBodyRefs));
    });
  }, [pathsTree]);

  // Responses
  const serializeResponses = useCallback(async (responses: APIResponse[]) => {
    const results: Response[] = [];
    for (const response of responses) {
      let responseRefs: object = {};
      response.flattenRefs.forEach((refObject) => {
        responseRefs = { ...responseRefs, ...refObject.rawDefinition };
      });

      results.push({
        status: response.status,
        rawDefinition: stringify(responseRefs),
      });

      await yieldToMainThread();
    }

    return results;
  }, []);

  const [responses, setResponses] = useState<Response[]>();
  useEffect(() => {
    if (!pathsTree?.responses) {
      setResponses(undefined);
      return;
    }

    serializeResponses(pathsTree.responses).then((responses) => {
      startTransition(() => {
        setResponses(responses);
      });
    });
  }, [pathsTree, serializeResponses]);

  // Component
  const component: Component | undefined = useMemo(() => {
    if (
      !yamlFileLeftSnap?.components ||
      !selectedItemSnap?.value?.selectedComponentNameLeft
    ) {
      return undefined;
    }

    return {
      name: selectedItemSnap.value.selectedComponentNameLeft,
      rawDefinition: stringify(
        yamlFileLeftSnap.components[
          selectedItemSnap.value.selectedComponentNameLeft
        ].rawDefinition,
      ),
    };
  }, [
    yamlFileLeftSnap.components,
    selectedItemSnap.value.selectedComponentNameLeft,
  ]);

  return (
    <CodePanel
      component={component}
      pathDefinition={pathDefinition}
      requestBodyRefsDefinition={requestBodyRefs}
      responses={responses}
    />
  );
});
