import { StoryObj, Parameters as Params, Meta } from '@storybook/html';
import VariantsHelper from '../../../../lib/variantsHelper';
import { ComponentConfig } from '../../../../types/context';

import buttonTemplate from './buttons.twig';
import defaultContext from './buttons.yml';


export default {
  title: 'Buttons',
} as Meta;

const baseObject: Partial<StoryObj> = {
  parameters: {
    render: (context: Record<string, unknown>): Promise<string> => {
      return buttonTemplate(context);
    }
  },
};

export const Default = VariantsHelper.createVariant(defaultContext as ComponentConfig, baseObject);

export const AccentCool = VariantsHelper.createVariant(defaultContext as ComponentConfig, baseObject, 'cool');

export const AccentWarm = VariantsHelper.createVariant(defaultContext as ComponentConfig, baseObject, 'warm');

export const Base = VariantsHelper.createVariant(defaultContext as ComponentConfig, baseObject, 'base');

export const Big = VariantsHelper.createVariant(defaultContext as ComponentConfig, baseObject, 'big');

export const Outline = VariantsHelper.createVariant(defaultContext as ComponentConfig, baseObject, 'outline');

export const OutlineInverse = VariantsHelper.createVariant(defaultContext as ComponentConfig, baseObject, 'outline_inverse');

export const Secondary = VariantsHelper.createVariant(defaultContext as ComponentConfig, baseObject, 'secondary');

export const Unstyled = VariantsHelper.createVariant(defaultContext as ComponentConfig, baseObject, 'unstyled');
