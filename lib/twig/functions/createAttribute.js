const Attributes = require('../../attributes.cjs');
const {
  TwingFunction
} = require('twing');

const createAttributeFunction = new TwingFunction('create_attribute', (attributes = {}) => {
  const newAttributes = attributes || {};
  return new Attributes(newAttributes);
});

module.exports = createAttributeFunction;
