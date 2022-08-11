class Attributes {
  constructor(seed) {
    this.values = {};

    if (typeof seed === 'object' && seed !== null) {
      Object.keys(seed)
        .filter((key) => key.substring(0, 1) !== '_')
        .forEach((key) =>
      {
        const val = seed[key];

        if (Array.isArray(val)) {
          this.addValue(key, ...val);
        } else {
          this.addValue(key, val);
        }
      });
    }
  }

  static createProxy(attributes) {
    return new Proxy(attributes, {
      get(target, name, receiver) {
        if (typeof name === 'string' && !Reflect.has(target, name)) {
          // Undo Twig's property name to method name conversion.
          const attributeName = name.replace(/^get/, '').toLowerCase();

          return target.getAttributeString(attributeName);
        }

        return Reflect.get(target, name, receiver);
      },
      has(target, key) {
        return Reflect.has(target, key) || Object.keys(target.values).includes(key);
      },
    });
  }

  addClass(...newClasses) {
    return this.addValue('class', ...newClasses);
  }

  hasClass(cls) {
    return this.hasValue('class', cls);
  }

  removeClass(cls) {
    this.removeValue('class', cls);
  }

  setAttribute(key, value) {
    this.removeAttribute(key);
    this.addValue(key, value);
  }

  removeAttribute(key) {
    if (this.values[key]) {
      delete this.values[key];
    }
  }

  removeValue(key, value) {
    if (this.values[key] && this.values[key].has(value)) {
      this.values[key].delete(value);
    }
  }

  hasValue(key, value) {
    return (this.values[key] && this.values[key].has(value));
  }

  addValue(key, ...newValues) {
    if (!this.values[key]) {
      this.values[key] = new Set();
    }

    newValues.forEach((value) => this.values[key].add(value));

    return this;
  }

  getAttributeString(key) {
    if (!this.values[key]) {
      return null;
    }

    return Array.from(this.values[key]).join(' ');
  }

  toString() {
    const output = Object.keys(this.values).map((key) => {
      const vals = this.values[key];
      const valsArray = Array.from(vals);

      return `${key}="${valsArray.join(' ')}"`;
    });

    return ` ${output.join(' ')}`;
  }
}

module.exports = Attributes;
