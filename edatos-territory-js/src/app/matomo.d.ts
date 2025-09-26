export {};

declare global {
  interface Window {
    _paq: { push: Array<unknown>['push'] };
  }
}
