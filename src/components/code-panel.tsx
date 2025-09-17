import { CodeBlock } from './code-block';

export type Response = {
  status: string;
  rawDefinition: string;
};

type Props = {
  component?: string;
  pathDefinition?: string;
  requestBodyRefsDefinition?: string;
  responses?: Response[];
};

export const CodePanel: React.FC<Props> = ({
  component,
  pathDefinition,
  requestBodyRefsDefinition,
  responses,
}) => {
  return (
    <div className="flex flex-col flex-wrap gap-5 py-5 pr-3">
      {component && <CodeBlock title="Component" code={component} />}

      {pathDefinition && (
        <CodeBlock title="Path definition" code={pathDefinition} />
      )}

      {requestBodyRefsDefinition && (
        <CodeBlock title="Request body" code={requestBodyRefsDefinition} />
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
};

export default CodePanel;
