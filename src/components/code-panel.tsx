import { memo } from 'react';
import { CodeBlock } from './code-block';

export type Response = {
  status: string;
  rawDefinition: string;
};

type Props = {
  pathDefinition?: string;
  requestBodyRefsDefinition?: string;
  responses?: Response[];
};

export const CodePanel: React.FC<Props> = memo(
  ({ pathDefinition, requestBodyRefsDefinition, responses }) => {
    return (
      <div className="flex flex-col flex-wrap gap-5 py-5 pr-3">
        <CodeBlock title="Path definition" code={pathDefinition} />

        <CodeBlock title="Request body" code={requestBodyRefsDefinition} />

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
