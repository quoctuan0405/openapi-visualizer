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
  if (store.mode !== 'path-viewer' && store.mode !== 'code-viewer') {
    store.mode = 'path-viewer';
  } else if (selectedItemStore.value.selectedComponentNameRight) {
    store.mode = 'object-tracing';
  }
});
