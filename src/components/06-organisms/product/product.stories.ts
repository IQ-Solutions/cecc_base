import { Meta, StoryObj } from '@storybook/html';
import VariantsHelper from '../../../../lib/variantsHelper';
import { ComponentConfig } from '../../../../types/context';
import cartTemplate from './cecc-publication--cart.twig';
import listTemplate from './cecc-publication--list.twig';
import cartContext from './product-cart.yml';
import featuredListTemplate from './product-featured-list.twig';
import featuredContext from './product-featured.yml';
import listContext from './product-list.yml';

export default {
  title: 'Product',
} as Meta;

const itemList = (story: () => unknown) => `<div class="item-list"><ul class="add-list-reset usa-collection"><li class="usa-collection__item border-bottom-2 padding-y-4">${story()}</li></ul></div>`;

export const Cart = VariantsHelper.createVariant(cartContext as ComponentConfig, {
  parameters: {
    render: (context: Record<string, unknown>): Promise<string> => cartTemplate(context),
  },
});

export const ListItem = VariantsHelper.createVariant(listContext as ComponentConfig, {
  parameters: {
    render: (context: Record<string, unknown>): Promise<string> => listTemplate({
      ...context,
      download_only: context.download_only ? 'On' : 'Off',
    }),
  },

  decorators: [
    story => itemList(story),
  ],
});

export const FeaturedItem: StoryObj = {
  ...ListItem,
  args: (featuredContext as ComponentConfig).context,
}

export const FeaturedList = VariantsHelper.createVariant(null, {
  parameters: {
    render: async (): Promise<string> => featuredListTemplate({
      rows: [
        await FeaturedItem.parameters!.render(FeaturedItem.args),
      ].map((item) => itemList(() => item))
      .join(""),
    }),
  },
});
