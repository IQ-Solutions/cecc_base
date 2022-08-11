export type ComponentContext = {};

export type ComponentVariant = {
  name: string;
  context?: ComponentContext;
};

export type ComponentConfig = {
  context?: ComponentContext;
  variants?: Readonly<Array<ComponentVariant>>;
};
