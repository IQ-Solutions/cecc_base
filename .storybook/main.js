const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = {
  core: {
    builder: 'webpack5',
  },

  refs: {
    'design-system': {
      title: 'USWDS',
      url: "https://develop--62def4ed396aba9fca47270b.chromatic.com/",
      expanded: false // optional, true by default
    },
  },

  // use CSF 3.0
  features: {
    storyStoreV7: true,
  },

  framework: '@storybook/html',

  stories: [
    path.resolve(__dirname, '..', 'src/components/**/*.stories.@(js|ts)'),
  ],

  staticDirs: [
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '..', 'src'),
  ],

  addons: [
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false, // not using this
      },
    },
    '@storybook/addon-a11y',
  ],

  typescript: {
    check: true,
  },

  webpackFinal: async (config) => {
    // enable top-level await (requires Webpack 5; see the top of this file)
    config.experiments = {
      ...(config.experiments ? config.experiments : {}),
      topLevelAwait: true,
    };

    // polyfill `Buffer` to make twing-loader compatible with Webpack 5; see https://viglucci.io/how-to-polyfill-buffer-with-webpack-5
    config.plugins.push(new ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));
    config.resolve = {
      ...(config.resolve ? config.resolve : {}),
      fallback: {
        ...(config.resolve?.fallback ? config.resolve.fallback : {}),
        buffer: require.resolve('buffer/'),
        util: false,
      },
    };

    config.module.rules.push({
      test: /\.ya?ml$/,
      loader: 'js-yaml-loader',
    });

    config.module.rules.push({
      test: /\.twig/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'twing-loader',
          options: {
            environmentModulePath: path.resolve(
              __dirname,
              'twing-environment.js'
            ),
          },
        },
        {
          loader: path.resolve(
            __dirname,
            'inject-relative-path-html-comments-loader.js'
          ),
        },
      ],
      include: path.resolve(__dirname, '..', 'src', 'components'),
    });

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
            sassOptions: {
              includePaths: [
                path.resolve(__dirname, '..', 'node_modules'),
                path.resolve(__dirname, '..', 'node_modules', 'uswds', 'src', 'stylesheets'),
              ],
            },
          },
        },
      ],
    });

    config.externals = {
      // jquery: 'jQuery',
      drupal: 'Drupal',
      drupalSettings: 'drupalSettings',
      // once: 'once',
    };

    return config;
  },
};
