import { proxy, subscribe } from 'valtio';
import { store as selectedItemStore } from '../selectedItem';
import type { Mode, Store } from './type';

// Store
export const store = proxy<Store>({
  mode: 'path-viewer',
  isShow: false,
});

// Action
export const setMode = (mode: Mode) => {
  if (store.mode === mode) {
    store.isShow = !store.isShow;
  } else {
    store.mode = mode;
  }
};

export const toggleIsShow = () => {
  store.isShow = !store.isShow;
};

// Subscription
subscribe(selectedItemStore, () => {
  const currentHistoryIndex = selectedItemStore.history.index;

  if (currentHistoryIndex > 0) {
    // Check if the right graph change
    const previousStore =
      selectedItemStore.history.nodes[currentHistoryIndex - 1].snapshot;
    if (
      previousStore.selectedPathRight !==
        selectedItemStore.value.selectedPathRight ||
      previousStore.selectedComponentNameRight !==
        selectedItemStore.value.selectedComponentNameRight
    ) {
      autoSwitchToCorrectMode();
    }
  } else {
    // The first time
    autoSwitchToCorrectMode();
  }
});

const autoSwitchToCorrectMode = () => {
  if (selectedItemStore.value.selectedPathRight) {
    if (store.mode !== 'path-viewer' && store.mode !== 'code-viewer') {
      store.mode = 'path-viewer';
    }
  } else if (selectedItemStore.value.selectedComponentNameRight) {
    if (store.mode !== 'object-tracing' && store.mode !== 'missing-refs') {
      store.mode = 'object-tracing';
    }
  }
};
