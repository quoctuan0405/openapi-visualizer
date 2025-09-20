import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { stringify } from 'yaml';
import { yieldToMainThread } from '../lib/yieldToMainThread';
import type {
  Response as APIResponse,
  ComponentNode,
  PathNode,
  RequestBody,
} from '../store/yamlFile/type-and-utils';
import { CodeBlock } from './code-block';

export type Response = {
  status: string;
  rawDefinition: string;
};

export type Component = {
  name: string;
  rawDefinition: string;
};

type Props = {
  pathsTree?: Record<string, PathNode>;
  selectedPath?: string;
  components?: Record<string, ComponentNode>;
  selectedComponent?: string;
};

export const CodePanel = memo<Props>(
  ({ pathsTree, selectedPath, components, selectedComponent }) => {
    // Path tree
    const pathNode = useMemo(() => {
      if (pathsTree && selectedPath) {
        return pathsTree[selectedPath];
      }

      return undefined;
    }, [pathsTree, selectedPath]);

    // Path definition
    const [pathDefinition, setPathDefinition] = useState<string>();

    useEffect(() => {
      if (!pathNode) {
        setPathDefinition(undefined);
        return;
      }

      startTransition(() => {
        setPathDefinition(
          stringify({
            [pathNode.path]: pathNode.rawDefinition,
          }),
        );
      });
    }, [pathNode]);

    // Request body
    const serializeRequestBodyRefs = useCallback(
      async (requestBody: RequestBody) => {
        let requestBodyRefs: object = {};
        requestBody.flattenRefs.forEach((refObject) => {
          requestBodyRefs = { ...requestBodyRefs, ...refObject.rawDefinition };
        });

        await yieldToMainThread();

        const result = stringify(requestBodyRefs);

        await yieldToMainThread();

        return result;
      },
      [],
    );

    const [requestBodyRefs, setRequestBodyRefs] = useState<string>();
    useEffect(() => {
      if (!pathNode || !pathNode.requestBody) {
        setRequestBodyRefs(undefined);
        return;
      }

      serializeRequestBodyRefs(pathNode.requestBody).then((requestBodyRefs) => {
        startTransition(() => {
          setRequestBodyRefs(requestBodyRefs);
        });
      });
    }, [pathNode, serializeRequestBodyRefs]);

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
      if (!pathNode?.responses) {
        setResponses(undefined);
        return;
      }

      serializeResponses(pathNode.responses).then((responses) => {
        startTransition(() => {
          setResponses(responses);
        });
      });
    }, [pathNode, serializeResponses]);

    // Component
    const component: Component | undefined = useMemo(() => {
      if (!components || !selectedComponent) {
        return undefined;
      }

      return {
        name: selectedComponent,
        rawDefinition: stringify(components[selectedComponent].rawDefinition),
      };
    }, [components, selectedComponent]);

    return (
      <div className="flex flex-col flex-wrap gap-5 py-5 pr-3">
        {component && (
          <CodeBlock title={component.name} code={component.rawDefinition} />
        )}

        {pathDefinition && (
          <CodeBlock title="Path definition" code={pathDefinition} />
        )}

        {requestBodyRefs && (
          <CodeBlock title="Request body" code={requestBodyRefs} />
        )}

        {responses?.map((response) => (
          <CodeBlock
            key={response.status}
            title={response.status}
            code={response.rawDefinition}
          />
        ))}
      </div>
    );
  },
);

export default CodePanel;
