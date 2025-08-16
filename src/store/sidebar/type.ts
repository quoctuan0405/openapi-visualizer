export type Mode = 'path-viewer' | 'object-tracing' | 'code-viewer';

export type Store = {
  isShow?: boolean;
  mode: Mode;
};
