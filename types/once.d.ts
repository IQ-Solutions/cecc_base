declare module '@drupal/once' {
  const once: (id: string, selector: string, context?: unknown) => Array<Element>;

  export default once;
}
