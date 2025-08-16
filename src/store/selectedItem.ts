import { proxyWithHistory } from 'valtio-history';

export type Store = {
  selectedPathLeft?: string;
  selectedComponentNameLeft?: string;
  selectedPathRight?: string;
  selectedComponentNameRight?: string;
};

// Store
export const store = proxyWithHistory<Store>({
  selectedPathLeft: undefined,
  selectedComponentNameLeft: undefined,
  selectedPathRight: undefined,
  selectedComponentNameRight: undefined,
});

// Action
export const setSelectedPathLeft = (path: string) => {
  store.value = {
    selectedPathLeft: path,
    selectedComponentNameLeft: undefined,
  };
};

export const setSelectedComponentLeft = (componentName: string) => {
  store.value = {
    selectedPathLeft: undefined,
    selectedComponentNameLeft: componentName,
  };
};

export const setSelectedPathRight = (path: string) => {
  store.value = {
    selectedPathRight: path,
    selectedComponentNameRight: undefined,
  };
};

export const setSelectedComponentRight = (componentName: string) => {
  store.value = {
    selectedPathRight: undefined,
    selectedComponentNameRight: componentName,
  };
};
