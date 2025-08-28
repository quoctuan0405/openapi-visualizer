export type Mode =
  | 'path-viewer'
  | 'object-tracing'
  | 'code-viewer'
  | 'missing-refs';

export type Store = {
  isShow?: boolean;
  mode: Mode;
};
