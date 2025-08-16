import Dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';

export type MessageDataIn = {
  nodes: Node[];
  edges: Edge[];
};

export type MessageDataOut = {
  nodes: Node[];
};

self.onmessage = (event) => {
  const { nodes, edges }: MessageDataIn = JSON.parse(event.data);

  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR' });

  for (const node of nodes) {
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    });
  }

  for (const edge of edges) {
    g.setEdge({
      v: edge.source,
      w: edge.target,
    });
  }

  Dagre.layout(g);

  const results: Node[] = [];
  for (const node of nodes) {
    const position = g.node(node.id);
    const x = position.x - (node.measured?.width ?? 0) / 2;
    const y = position.y - (node.measured?.height ?? 0) / 2;

    results.push({ ...node, position: { x, y } });
  }

  self.postMessage({ nodes: results });
};
