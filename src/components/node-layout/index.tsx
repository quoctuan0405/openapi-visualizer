import { graphlib, layout } from '@dagrejs/dagre';
import {
  applyNodeChanges,
  type Edge,
  type Node,
  type NodeChange,
  useNodesInitialized,
  useReactFlow,
} from '@xyflow/react';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { yieldToMainThread } from '../../lib/yieldToMainThread';
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

export const NodeLayout: React.FC = () => {
  const snap = useSnapshot(store) as Store;
  const isNodeInitialized = useNodesInitialized({ includeHiddenNodes: false });
  const { getNodesBounds } = useReactFlow();

  useEffect(() => {
    if (isNodeInitialized) {
      if (snap.isAddedButNotPositionCorrectlyLeft) {
        const leftGraphNodes: Node[] = [];
        const leftGraphEdges: Edge[] = [];

        for (const node of snap.nodes) {
          if (!node.measured?.width || !node.measured.height) {
            return;
          }

          if (snap.leftGraphNodeIds.find((nodeId) => nodeId === node.id)) {
            leftGraphNodes.push(node);
          }
        }

        for (const edge of snap.edges) {
          if (snap.leftGraphEdgeIds.find((edgeId) => edgeId === edge.id)) {
            leftGraphEdges.push(edge);
          }
        }

        // calculateNodeLayoutWorker.postMessage(
        //   JSON.stringify({
        //     nodes: snap.nodes,
        //     edges: snap.edges,
        //   }),
        // );

        calculateNodeLayout({
          nodes: leftGraphNodes,
          edges: leftGraphEdges,
        }).then((nodeChanges) => {
          if (nodeChanges) {
            setNodes(applyNodeChanges(nodeChanges, snap.nodes));
            store.isAddedButNotPositionCorrectlyLeft = false;
          }
        });
      } else if (snap.isAddedButNotPositionCorrectlyRight) {
        const rightGraphNodes: Node[] = [];
        const rightGraphEdges: Edge[] = [];

        for (const node of snap.nodes) {
          if (!node.measured?.width || !node.measured.height) {
            return;
          }

          if (snap.rightGraphNodeIds.find((nodeId) => nodeId === node.id)) {
            rightGraphNodes.push(node);
          }
        }

        for (const edge of snap.edges) {
          if (snap.rightGraphEdgeIds.find((edgeId) => edgeId === edge.id)) {
            rightGraphEdges.push(edge);
          }
        }

        const { width } = getNodesBounds(snap.leftGraphNodeIds);

        // calculateNodeLayoutWorker.postMessage(
        //   JSON.stringify({
        //     nodes: snap.nodes,
        //     edges: snap.edges,
        //   }),
        // );

        calculateNodeLayout({
          nodes: rightGraphNodes,
          edges: rightGraphEdges,
          startX: width + 100,
          startY: 0,
        }).then((nodeChanges) => {
          if (nodeChanges) {
            setNodes(applyNodeChanges(nodeChanges, snap.nodes));

            store.isAddedButNotPositionCorrectlyRight = false;
          }
        });
      }
    }
  }, [isNodeInitialized, snap, getNodesBounds]);

  return null;
};

type CalculateNodeLayoutParam = {
  nodes: Node[];
  edges: Edge[];
  startX?: number;
  startY?: number;
};

const calculateNodeLayout = async ({
  nodes,
  edges,
  startX,
  startY,
}: CalculateNodeLayoutParam) => {
  const g = new graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR' });

  for (const node of nodes) {
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    });

    yieldToMainThread();
  }

  for (const edge of edges) {
    g.setEdge({
      v: edge.source,
      w: edge.target,
    });

    yieldToMainThread();
  }

  layout(g);

  const nodeChanges: NodeChange[] = [];
  for (const node of nodes) {
    const position = g.node(node.id);
    const x = (startX || 0) + position.x - (node.measured?.width ?? 0) / 2;
    const y = (startY || 0) + position.y - (node.measured?.height ?? 0) / 2;

    nodeChanges.push({ id: node.id, type: 'position', position: { x, y } });
    yieldToMainThread();
  }

  return nodeChanges;
};
