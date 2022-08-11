declare module '*.twig' {
  const value: (twigContext: Record<string, unknown>) => Promise<string>;
  export default value;
}