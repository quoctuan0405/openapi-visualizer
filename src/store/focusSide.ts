import { proxy } from 'valtio';

export type Side = 'left' | 'right';

export type Store = {
  focusSide: Side;
};

// Store
export const store = proxy<Store>({
  focusSide: 'left',
});

// Action
export const setFocusSide = (side: Side) => {
  if (side !== store.focusSide) {
    store.focusSide = side;
  }
};
