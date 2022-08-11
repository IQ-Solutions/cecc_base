import { Story, StoryObj } from '@storybook/html';
import { ComponentConfig } from '../types/context';

export default class VariantsHelper {
  static getComponents() {
    const scriptImports = require.context(
      '/src/components',
      true,
      /(?<!stories)\.(?:j|t)s$/
    );

    const scriptModules = new Map(
      scriptImports.keys().map((key) => [key, scriptImports(key)])
    );

    return scriptModules;
  }

  static createVariant(config: ComponentConfig | null, baseObj: Partial<StoryObj>, name?: string): StoryObj {
    const components = VariantsHelper.getComponents();

    const defaultContext = config?.context || {};
    const variantConfig = config && config.variants?.find((configVariant) => configVariant.name === name);

    const mergedContext = {
      ...baseObj.args || {},
      ...defaultContext,
      ...variantConfig?.context || {},
    };

    const variant: StoryObj = {
      ...baseObj,
      name: name,
      args: mergedContext,
    };

    return variant;
  }
}
