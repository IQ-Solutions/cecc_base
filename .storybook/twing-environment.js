const Attributes = require('../lib/attributes.cjs');
const twigDrupal = require('twing-drupal-filters')
const createAttributesFunction = require('../lib/twig/functions/createAttribute.js');

const path = require('path');

const {
  TwingEnvironment,
  TwingLoaderFilesystem,
} = require('twing');

const componentPath = path.resolve(__dirname, '..', 'src', 'components');

const filesystemLoader = new TwingLoaderFilesystem([componentPath]);

if (filesystemLoader.addPath) {
  filesystemLoader.addPath(componentPath, 'components');
  filesystemLoader.addPath(path.resolve(componentPath, '06-organisms'), 'organisms');
}

const twing = new TwingEnvironment(filesystemLoader, {
  autoescape: false,
});

twigDrupal(twing);
twing.addFunction(createAttributesFunction);

const setProxyValue = (value) => {
  if (Array.isArray(value)) {
    for (element of value) {
      setProxyValue(element);
    }
  } else {
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((name) => {
        const val = value[name];

        if (typeof name === 'string' && name.indexOf('attributes') > -1 && !val.values) {
          const attributes = new Attributes(val);

          value[name] = Attributes.createProxy(attributes);

        } else if (typeof val === 'object' && val !== null) {
          setProxyValue(val);
        }
      });
    }
  }
}

twing.loadTemplate = new Proxy(twing.loadTemplate, {
  apply(target, thisArg, args) {
    return new Promise((resolve, reject) => {
      target.apply(thisArg, args)
      .then((template) => {
        template.render = new Proxy(template.render, {
          apply(renderTarget, renderThis, renderArgs) {
            setProxyValue(renderArgs);

            return renderTarget.apply(renderThis, renderArgs);
          }
        });

        resolve(template);
      })
      .catch((err) => reject(err));
    });
  },
});


// API: https://nightlycommit.github.io/twing/advanced.html

/*
  Note: in case there's need for custom Functions or Filters,
  remember that callbacks must return Promises in Twing (just make them `async`).
*/

module.exports = twing;
