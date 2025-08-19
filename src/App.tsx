import { ReactFlowProvider } from '@xyflow/react';
import './App.css';
import { ReactFlowCanvas } from './components/react-flow-canvas';
// import { AuroraBackground } from './components/aurora-background';
// import { Button } from './components/button';
import { SidebarLeft } from './components/sidebar-left';
import '@xyflow/react/dist/style.css';
import { lazy } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSnapshot } from 'valtio';
import { ActivityBarLeft } from './components/activity-bar-left';
import { ActivityBarRight } from './components/activity-bar-right';
import { CodePanelLeft } from './components/code-panel-left';
import { CodePanelRight } from './components/code-panel-right';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './components/resizable';
import { SidebarRight } from './components/sidebar-right';
import { store as focusSideStore } from './store/focusSide';
import {
  store as leftSidebarStore,
  toggleIsShow as toggleSidebarLeftIsShow,
} from './store/sidebar/sidebarLeft';
import {
  store as rightSidebarStore,
  toggleIsShow as toggleSidebarRightIsShow,
} from './store/sidebar/sidebarRight';

const Toaster = lazy(() => import('./components/toaster'));

const App = () => {
  const leftSidebarSnap = useSnapshot(leftSidebarStore);
  const rightSidebarSnap = useSnapshot(rightSidebarStore);
  const focusSideSnap = useSnapshot(focusSideStore);

  useHotkeys(
    'Ctrl + B',
    (e) => {
      e.preventDefault();
      if (focusSideSnap.focusSide === 'left') {
        toggleSidebarLeftIsShow();
      } else {
        toggleSidebarRightIsShow();
      }
    },
    { enableOnFormTags: true },
  );

  return (
    <>
      <Toaster />

      {/* <AuroraBackground> */}
      <ResizablePanelGroup className="max-h-screen" direction="horizontal">
        <ActivityBarLeft />

        {/* Sidebar left */}
        {leftSidebarSnap.isShow && (
          <>
            <ResizablePanel id="sidebar-left" defaultSize={20} order={1}>
              <SidebarLeft />
            </ResizablePanel>
            <ResizableHandle className="w-1.5 dark:bg-neutral-900" />
          </>
        )}

        {/* Sidebar code left */}
        {leftSidebarSnap.mode === 'code-viewer' && (
          <>
            <ResizablePanel
              id="sidebar-code-left"
              defaultSize={30}
              order={2}
              className="!overflow-x-scroll !overflow-y-scroll dark:bg-neutral-900 dark:scrollbar dark:scrollbar-thumb-neutral-800 dark:scrollbar-track-neutral-900"
            >
              <CodePanelLeft />
            </ResizablePanel>
            <ResizableHandle className="w-1.5 dark:bg-neutral-900" />
          </>
        )}

        {/* ReactFlow canvas */}
        <ResizablePanel id="reactflow-canvas" order={3}>
          <ReactFlowProvider>
            <ReactFlowCanvas />
          </ReactFlowProvider>
        </ResizablePanel>
        {(rightSidebarSnap.mode === 'code-viewer' ||
          rightSidebarSnap.isShow) && <ResizableHandle className="w-1.5" />}

        {/* Sidebar code right */}
        {rightSidebarSnap.mode === 'code-viewer' && (
          <>
            <ResizablePanel
              id="sidebar-code-right"
              defaultSize={30}
              order={4}
              className="!overflow-x-scroll !overflow-y-scroll dark:scrollbar dark:scrollbar-thumb-neutral-800 dark:scrollbar-track-neutral-900"
            >
              <CodePanelRight />
            </ResizablePanel>
            {rightSidebarSnap.isShow && (
              <ResizableHandle className="w-1.5 dark:bg-neutral-900" />
            )}
          </>
        )}

        {/* Sidebar right */}
        {rightSidebarSnap.isShow && (
          <ResizablePanel id="sidebar-right" defaultSize={20} order={5}>
            <SidebarRight />
          </ResizablePanel>
        )}

        <ActivityBarRight />
      </ResizablePanelGroup>
      {/* </AuroraBackground> */}
    </>
  );
};

export default App;
