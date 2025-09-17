import { graphlib, layout } from '@dagrejs/dagre';
import {
  applyNodeChanges,
  type NodeChange,
  useNodesInitialized,
  useReactFlow,
} from '@xyflow/react';
import { memo, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { type Store, setNodes, store } from '../../store/reactFlow';
// import type { MessageDataOut } from './calculate-node-layout-worker';

// This is a failed attempt to make it faster using web worker
// In fact, it's much slower but I'll keep it here as a reference
// https://rsbuild.rs/guide/basic/web-workers

// const calculateNodeLayoutWorker = new Worker(
//   new URL('./calculate-node-layout-worker.ts', import.meta.url),
// );

// calculateNodeLayoutWorker.onmessage = ({
//   data: { nodes },
// }: MessageEvent<MessageDataOut>) => {
//   setNodes(nodes);
//   store.isPositionCorrectly = true;
// };

export const NodeLayout: React.FC = memo(() => {
  const snap = useSnapshot(store) as Store;
  const isNodeInitialized = useNodesInitialized({ includeHiddenNodes: false });
  const { getNodesBounds } = useReactFlow();

  useEffect(() => {
    if (isNodeInitialized) {
      const g = new graphlib.Graph().setDefaultEdgeLabel(() => ({}));
      g.setGraph({ rankdir: 'LR' });

      if (snap.isAddedButNotPositionCorrectlyLeft) {
        for (const node of snap.nodes) {
          if (!node.measured?.width || !node.measured.height) {
            return;
          }

          if (snap.leftGraphNodeIds.indexOf(node.id) !== -1) {
            g.setNode(node.id, {
              width: node.measured.width,
              height: node.measured.height,
            });
          }
        }

        for (const edge of snap.edges) {
          if (snap.leftGraphEdgeIds.indexOf(edge.id) !== -1) {
            g.setEdge({
              v: edge.source,
              w: edge.target,
            });
          }
        }

        layout(g);

        const nodeChanges: NodeChange[] = [];
        for (const nodeId of g.nodes()) {
          const node = g.node(nodeId);
          const x = node.x - node.width / 2;
          const y = node.y - node.height / 2;

          nodeChanges.push({
            id: nodeId,
            type: 'position',
            position: { x, y },
          });
        }

        setNodes(applyNodeChanges(nodeChanges, snap.nodes));
        store.isAddedButNotPositionCorrectlyLeft = false;

        // calculateNodeLayoutWorker.postMessage(
        //   JSON.stringify({
        //     nodes: snap.nodes,
        //     edges: snap.edges,
        //   }),
        // );
      } else if (snap.isAddedButNotPositionCorrectlyRight) {
        for (const node of snap.nodes) {
          if (!node.measured?.width || !node.measured.height) {
            return;
          }

          if (snap.rightGraphNodeIds.indexOf(node.id) !== -1) {
            g.setNode(node.id, {
              width: node.measured.width,
              height: node.measured.height,
            });
          }
        }

        for (const edge of snap.edges) {
          if (snap.rightGraphEdgeIds.indexOf(edge.id) !== -1) {
            g.setEdge({
              v: edge.source,
              w: edge.target,
            });
          }
        }

        layout(g);

        const { width } = getNodesBounds(snap.leftGraphNodeIds);

        // calculateNodeLayoutWorker.postMessage(
        //   JSON.stringify({
        //     nodes: snap.nodes,
        //     edges: snap.edges,
        //   }),
        // );

        const nodeChanges: NodeChange[] = [];
        for (const nodeId of g.nodes()) {
          const node = g.node(nodeId);
          const x = width + 100 + node.x - node.width / 2;
          const y = node.y - node.height / 2;

          nodeChanges.push({
            id: nodeId,
            type: 'position',
            position: { x, y },
          });
        }

        setNodes(applyNodeChanges(nodeChanges, snap.nodes));
        store.isAddedButNotPositionCorrectlyRight = false;
      }
    }
  }, [isNodeInitialized, snap, getNodesBounds]);

  return null;
});
