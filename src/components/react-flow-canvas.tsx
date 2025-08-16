import {
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  type Node,
  type OnNodesChange,
  ReactFlow,
} from '@xyflow/react';
import { memo, useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { cn } from '../lib/cn';
import { store as darkModeStore } from '../store/darkmode';
import { nodeTypes, type Store, setNodes, store } from '../store/reactFlow';
import { NodeLayout } from './node-layout';
import { UndoRedoPanel } from './undo-redo-panel';

export const ReactFlowCanvas: React.FC = memo(() => {
  const snap = useSnapshot(store) as Store;
  const { isDarkMode } = useSnapshot(darkModeStore);

  const onNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => setNodes(applyNodeChanges(changes, snap.nodes)),
    [snap],
  );

  return (
    <ReactFlow
      className={cn('duration-200', {
        'opacity-50': !snap.isRenderPositionSuccessfully,
        'opacity-100': snap.isRenderPositionSuccessfully,
      })}
      colorMode={isDarkMode ? 'dark' : 'light'}
      autoPanOnNodeFocus={false}
      nodesFocusable={false}
      edgesFocusable={false}
      nodeTypes={nodeTypes}
      nodes={snap.nodes}
      edges={snap.edges}
      onNodesChange={onNodesChange}
      onlyRenderVisibleElements
    >
      <UndoRedoPanel />
      <Controls />
      <NodeLayout />
      <Background />
      <MiniMap className="cursor-grab" nodeStrokeWidth={3} pannable />
    </ReactFlow>
  );
});
