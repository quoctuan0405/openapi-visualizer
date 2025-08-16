import type { Edge, Node, NodeTypes } from '@xyflow/react';
import { proxy, subscribe } from 'valtio';
import { subscribeKey } from 'valtio/utils';
import {
  ComponentViewer,
  type ComponentViewerNode,
} from '../components/react-flow-node/component-viewer';
import { PathViewer } from '../components/react-flow-node/path-viewer';
import { yieldToMainThread } from '../lib/yieldToMainThread';
import type { Side } from './focusSide';
import { store as selectedItemStore } from './selectedItem';
import type { ComponentNode, PathNode } from './yamlFile/type-and-utils';
import { store as yamlFileLeftStore } from './yamlFile/yamlFileLeft';
import { store as yamlFileRightStore } from './yamlFile/yamlFileRight';

export const dragHandleClass = 'drag-handle__custom';

export const pathViewerType = 'path-viewer';
export const componentViewerType = 'component-viewer';

export const nodeTypes: NodeTypes = {
  [componentViewerType]: ComponentViewer,
  [pathViewerType]: PathViewer,
};

export type Store = {
  isRenderPositionSuccessfully: boolean;
  isAddedButNotPositionCorrectlyLeft: boolean;
  isAddedButNotPositionCorrectlyRight: boolean;
  leftGraphNodeIds: string[];
  leftGraphEdgeIds: string[];
  rightGraphNodeIds: string[];
  rightGraphEdgeIds: string[];
  nodes: Node[];
  edges: Edge[];
};

// Store
export const store = proxy<Store>({
  isRenderPositionSuccessfully: true,
  isAddedButNotPositionCorrectlyLeft: false,
  isAddedButNotPositionCorrectlyRight: false,
  leftGraphNodeIds: [],
  leftGraphEdgeIds: [],
  rightGraphNodeIds: [],
  rightGraphEdgeIds: [],
  nodes: [],
  edges: [],
});

// Actions
export const setIsRenderPositionSuccessfully = (
  isRenderPositionSuccessfully: boolean,
) => {
  store.isRenderPositionSuccessfully = isRenderPositionSuccessfully;
};

export const setNodes = (nodes: Node[]) => {
  store.nodes = nodes;
};

// Subscription
subscribe(selectedItemStore, async () => {
  if (
    selectedItemStore.value.selectedPathLeft &&
    yamlFileLeftStore.pathsTree?.[selectedItemStore.value.selectedPathLeft]
  ) {
    // Add node path left
    const otherNodes = store.nodes.filter(
      ({ id }) => !store.leftGraphNodeIds.find((nodeId) => nodeId === id),
    );
    const otherEdges = store.edges.filter(
      ({ id }) => !store.leftGraphEdgeIds.find((edgeId) => edgeId === id),
    );

    const { nodes, edges } = await createPathGraph(
      yamlFileLeftStore.pathsTree[selectedItemStore.value.selectedPathLeft],
      'left',
    );

    store.leftGraphNodeIds = Object.keys(nodes);
    store.leftGraphEdgeIds = Object.keys(edges);
    store.nodes = [...otherNodes, ...Object.values(nodes)];
    store.edges = [...otherEdges, ...Object.values(edges)];
    store.isAddedButNotPositionCorrectlyLeft = true;
  } else if (
    // Add node component left
    selectedItemStore.value.selectedComponentNameLeft &&
    yamlFileLeftStore.components?.[
      selectedItemStore.value.selectedComponentNameLeft
    ]
  ) {
    // Add node path left
    const otherNodes = store.nodes.filter(
      ({ id }) => !store.leftGraphNodeIds.find((nodeId) => nodeId === id),
    );
    const otherEdges = store.edges.filter(
      ({ id }) => !store.leftGraphEdgeIds.find((edgeId) => edgeId === id),
    );

    const { nodes, edges } = await createObjectGraph(
      yamlFileLeftStore.components[
        selectedItemStore.value.selectedComponentNameLeft
      ],
      'left',
    );

    store.leftGraphNodeIds = Object.keys(nodes);
    store.leftGraphEdgeIds = Object.keys(edges);
    store.nodes = [...otherNodes, ...Object.values(nodes)];
    store.edges = [...otherEdges, ...Object.values(edges)];
    store.isAddedButNotPositionCorrectlyLeft = true;
  } else if (
    selectedItemStore.value.selectedPathRight &&
    yamlFileRightStore.pathsTree?.[selectedItemStore.value.selectedPathRight]
  ) {
    // Add node path right
    const otherNodes = store.nodes.filter(
      ({ id }) => !store.rightGraphNodeIds.find((nodeId) => nodeId === id),
    );
    const otherEdges = store.edges.filter(
      ({ id }) => !store.rightGraphEdgeIds.find((edgeId) => edgeId === id),
    );

    const { nodes, edges } = await createPathGraph(
      yamlFileRightStore.pathsTree[selectedItemStore.value.selectedPathRight],
      'right',
    );

    store.rightGraphNodeIds = Object.keys(nodes);
    store.rightGraphEdgeIds = Object.keys(edges);
    store.nodes = [...otherNodes, ...Object.values(nodes)];
    store.edges = [...otherEdges, ...Object.values(edges)];
    store.isAddedButNotPositionCorrectlyRight = true;
  } else if (
    selectedItemStore.value.selectedComponentNameRight &&
    yamlFileRightStore.components?.[
      selectedItemStore.value.selectedComponentNameRight
    ]
  ) {
    // Add node component right
    const otherNodes = store.nodes.filter(
      ({ id }) => !store.rightGraphNodeIds.find((nodeId) => nodeId === id),
    );
    const otherEdges = store.edges.filter(
      ({ id }) => !store.rightGraphEdgeIds.find((edgeId) => edgeId === id),
    );

    const { nodes, edges } = await createObjectGraph(
      yamlFileRightStore.components[
        selectedItemStore.value.selectedComponentNameRight
      ],
      'right',
    );

    store.rightGraphNodeIds = Object.keys(nodes);
    store.rightGraphEdgeIds = Object.keys(edges);
    store.nodes = [...otherNodes, ...Object.values(nodes)];
    store.edges = [...otherEdges, ...Object.values(edges)];
    store.isAddedButNotPositionCorrectlyRight = true;
  }
});

subscribe(selectedItemStore, () => {
  if (
    selectedItemStore.value.selectedPathLeft ||
    selectedItemStore.value.selectedComponentNameLeft ||
    selectedItemStore.value.selectedPathRight ||
    selectedItemStore.value.selectedComponentNameRight
  ) {
    store.isRenderPositionSuccessfully = false;
  }
});

subscribeKey(store, 'isAddedButNotPositionCorrectlyLeft', () => {
  if (!store.isAddedButNotPositionCorrectlyLeft) {
    store.isRenderPositionSuccessfully = true;
  }
});

subscribeKey(store, 'isAddedButNotPositionCorrectlyRight', () => {
  if (!store.isAddedButNotPositionCorrectlyRight) {
    store.isRenderPositionSuccessfully = true;
  }
});

const createObjectGraph = async (
  componentTree: ComponentNode,
  graphSide: Side,
) => {
  const nodes: Record<string, Node | ComponentViewerNode> = {};
  const edges: Record<string, Edge> = {};

  const addNodeAndEdge = async (component: ComponentNode | PathNode) => {
    await yieldToMainThread();

    if (isPathNode(component)) {
      // Component is PathNode
      const pathTreeId = `${component.method.toUpperCase()} ${component.path} ${graphSide}`;

      nodes[pathTreeId] = {
        id: pathTreeId,
        type: pathViewerType,
        dragHandle: `.${dragHandleClass}`,
        position: { x: 0, y: 0 },
        data: {
          path: component.path,
          method: component.method,
          parameters: component.parameters,
          requestBody: component.requestBody,
          responses: component.responses,
        },
      };
    } else {
      // Component is ComponentNode
      const componentId = `${component.name} ${graphSide}`;
      nodes[componentId] = {
        id: componentId,
        type: componentViewerType,
        dragHandle: `.${dragHandleClass}`,
        position: { x: 0, y: 0 },
        data: { ...component, graphSide },
      };

      if (component.parents) {
        for (const parent of component.parents) {
          const refId = isPathNode(parent)
            ? `${parent.method.toUpperCase()} ${parent.path} ${graphSide}`
            : `${parent.name} ${graphSide}`;
          const edgeId = `${component.name}-${refId} ${graphSide}`;
          edges[edgeId] = {
            id: edgeId,
            source: componentId,
            target: refId,
          };

          await addNodeAndEdge(parent);
        }
      }
    }
  };

  await addNodeAndEdge(componentTree);

  return { nodes, edges };
};

const isPathNode = (
  component: ComponentNode | PathNode,
): component is PathNode => {
  return Object.hasOwn(component, 'path');
};

const createPathGraph = async (pathTree: PathNode, graphSide: Side) => {
  const nodes: Record<string, Node | ComponentViewerNode> = {};
  const edges: Record<string, Edge> = {};

  // Path
  const pathTreeId = `${pathTree.method.toUpperCase()} ${pathTree.path} ${graphSide}`;

  nodes[pathTreeId] = {
    id: pathTreeId,
    type: pathViewerType,
    dragHandle: `.${dragHandleClass}`,
    position: { x: 0, y: 0 },
    data: {
      path: pathTree.path,
      method: pathTree.method,
      parameters: pathTree.parameters,
      requestBody: pathTree.requestBody,
      responses: pathTree.responses,
    },
  };

  // Request and responses
  const addNodeAndEdge = async (component: ComponentNode) => {
    await yieldToMainThread();

    const componentId = `${component.name} ${graphSide}`;
    nodes[componentId] = {
      id: componentId,
      type: componentViewerType,
      dragHandle: `.${dragHandleClass}`,
      position: { x: 0, y: 0 },
      data: { ...component, graphSide },
    };

    if (component.refs) {
      for (const ref of component.refs) {
        const refId = `${ref.name} ${graphSide}`;
        const edgeId = `${component.name}-${refId} ${graphSide}`;
        edges[edgeId] = {
          id: edgeId,
          source: componentId,
          target: refId,
        };

        await addNodeAndEdge(ref);
      }
    }
  };

  if (pathTree.requestBody?.refs) {
    for (const refObj of pathTree.requestBody.refs) {
      await addNodeAndEdge(refObj);

      const edgeId = `${pathTreeId}-${refObj.name} ${graphSide}`;
      edges[edgeId] = {
        id: edgeId,
        source: pathTreeId,
        target: `${refObj.name} ${graphSide}`,
      };
    }
  }

  if (pathTree.responses) {
    for (const response of pathTree.responses) {
      if (!response.refs) {
        continue;
      }

      for (const refObj of response.refs) {
        await addNodeAndEdge(refObj);

        const edgeId = `${pathTreeId}-${refObj.name} ${graphSide}`;
        edges[edgeId] = {
          id: edgeId,
          source: pathTreeId,
          target: `${refObj.name} ${graphSide}`,
        };
      }
    }
  }

  return { nodes, edges };
};
