declare module 'drupal' {
  export type DrupalBehavior = {
    attach: (context?: {}, settings?: {}) => void;
  };

  export type DrupalBehaviors = {
    [name: string]: DrupalBehavior;
  };

  export const behaviors: DrupalBehaviors
}
