import once from '@drupal/once';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { useEffect } from '@storybook/addons';
import * as jQuery from 'jquery';
import '../src/scss/styles.scss';
import './script-runner';
import './_drupal.js';

global.jQuery = jQuery;
global.$ = jQuery;
global.once = once;

export const loaders = [
  async ({ args, parameters }) => {
    const renderedStory = await parameters.render(args);
    return { renderedStory };
  },
];

export const decorators = [
  (StoryFn) => {
    useEffect(() => Drupal.attachBehaviors(document.getElementById('root')), []);
    return StoryFn();
  },
];

export const render = (_, { loaded: { renderedStory } }) => renderedStory;

export const parameters = {
  layout: 'fullscreen',

  // necessary (for now) b/c inline docs are incompatible w/ loaders: https://github.com/storybookjs/storybook/issues/12726
  docs: {
    inlineStories: false,
    iframeHeight: 800,
  },

  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
};
