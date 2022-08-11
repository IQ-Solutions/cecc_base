const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const dartSass = require('sass');

module.exports = {
  entry: () => {
    // Grab any JS files.
    const jsFiles = glob
      .sync('src/**/!(*.stories).[t|j]s', {
        ignore: ['**/_*'],
      })
      .reduce((entries, currentFile) => {
        const updatedEntries = entries;
        const filePaths = currentFile.split(path.sep);
        const sourceDirIndex = filePaths.indexOf('src');
        if (sourceDirIndex >= 0) {
          const ext = path.extname(currentFile);
          const fileName = path.basename(currentFile, ext);
          const newFilePath = `js/${fileName}`;
          // Throw an error if duplicate files detected.
          if (updatedEntries[newFilePath]) {
            throw new Error(`More than one file named ${fileName}.js found.`);
          }
          updatedEntries[newFilePath] = {
            import: path.resolve(__dirname, currentFile),
          };
        }
        return updatedEntries;
      }, {});
    // Grab any SCSS files that aren't prefixed with _.
    const scssFiles = glob
      .sync('src/**/*.scss', {
        ignore: ['**/_*'],
      })
      .reduce((entries, currentFile) => {
        const updatedEntries = entries;
        const filePaths = currentFile.split(path.sep);
        const sourceDirIndex = filePaths.indexOf('src');
        if (sourceDirIndex >= 0) {
          const fileName = path.basename(currentFile, '.scss');
          const newFilePath = `css/${fileName}`;
          // Throw an error if duplicate files detected.
          if (updatedEntries[newFilePath]) {
            throw new Error(`More that one file named ${fileName}.scss found.`);
          }
          updatedEntries[newFilePath] = {
            import: `./${currentFile}`,
          };
        }
        return updatedEntries;
      }, {});
    return {
      ...jsFiles,
      ...scssFiles,
    };
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new RemovePlugin({
      before: {
        include: [
          './dist',
        ],
      },
      after: {
        test: [
          {
            folder: './dist',
            method: absolutePath =>
              new RegExp(/\.js(\.map)?$/, 'm').test(absolutePath),
            recursive: true,
          },
        ],
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              // Ignore /core/ URLs
              url: {
                filter: url => !url.includes('/core/'),
              },
            },
          },
          'resolve-url-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: dartSass,
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src'), './node_modules/uswds/src/stylesheets'],
              },
            },
          },
        ],
      },
      {
        test: /fonts\/.*\.(woff2?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        exclude: ['/node_modules/'],
        type: 'asset/resource',
        generator: {
         filename: 'fonts/[hash][ext][query]'
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        exclude: [/images\/_sprite-source-files\/.*\.svg$/, '/node_modules/'],
        type: 'asset',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
    ],
  },
  externals: {
    jquery: 'jQuery',
    drupal: 'Drupal',
    drupalSettings: 'drupalSettings',
    '@drupal/once': 'once',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
};
