const path = require('path');

module.exports = function (source) {
  const relativePath = '/' + path.relative(this.rootContext, this.resourcePath);

  if (source.trimStart().startsWith('{% extends ')) {
    return `{% block _startExtends %}<!-- START: ${relativePath} -->{% endblock %}\n${source}\n{% block _endExtends %}<!-- END: ${relativePath} -->{% endblock %}`;
  } else {
    return `<!-- START: ${relativePath} -->\n${source}\n<!-- END: ${relativePath} -->`;
  }
};
