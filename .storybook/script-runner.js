if (module.hot) {
  module.hot.decline();
}

window.IS_STORYBOOK = true;

const root = document.querySelector('#root');
const docsRoot = document.querySelector('#docs-root');

const scriptImports = require.context(
  '/src/components',
  true,
  /(?<!stories)\.(?:j|t)s$/
);

const scriptModules = new Map(
  scriptImports.keys().map((key) => [key, scriptImports(key)])
);

if (module.hot) {
  module.hot.accept(scriptImports.id, () => {
    const freshScriptImports = require.context(
      '/src/components',
      true,
      /(?<!stories)\.(?:j|t)s$/
    );

    const freshScriptModules = new Map(
      freshScriptImports.keys().map((key) => [key, freshScriptImports(key)])
    );

    for (const [key] of scriptModules) {
      if (!freshScriptModules.has(key)) scriptModules.delete(key);
    }

    const twigImports = require.context('/src/components', true, /\.twig$/);
    const twigKeys = twigImports.keys();
    module.hot.accept(twigImports.id);

    for (const [key, scriptModule] of freshScriptModules) {
      if (scriptModules.get(key) === scriptModule) continue;

      scriptModules.set(key, scriptModule);

      if (typeof scriptModule.default !== 'function') continue;

      const fn = scriptModule.default;

      const twigImports = require.context('/src/components', true, /\.twig$/);
      module.hot.accept(twigImports.id);

      const candidateTwigKey = key.replace(/(?:j|t)s$/, 'twig');
      const twigKey = twigKeys.find((e) => e === candidateTwigKey);

      if (!twigKey) continue;

      const twigPath = twigKey.slice(1);

      const nodeIterator = document.createNodeIterator(
        root,
        NodeFilter.SHOW_COMMENT
      );
      let currentNode;
      while ((currentNode = nodeIterator.nextNode())) {
        if (currentNode.nodeValue?.trim().endsWith(twigPath)) {
          console.log(
            `[STORYBOOK TWIG SCRIPT-RUNNER] hot-replacing ${twigPath} to execute ${
              fn.name || 'anonymous function'
            } on fresh markup`
          );
          require.cache[twigImports.resolve(twigKey)]?.hot.invalidate();
          break;
        }
      }
    }
  });
}

const removers = new Set();
window.observers = new Set();

EventTarget.prototype.addEventListener = new Proxy(
  EventTarget.prototype.addEventListener, {
    apply(addEventListener, eventTarget, args) {
      if (eventTarget instanceof Element && !docsRoot.contains(eventTarget)) {
        removers.add(() =>
          eventTarget.removeEventListener(...args)
        );
      }
      return addEventListener.apply(eventTarget, args);
    },
  }
);

new MutationObserver(() => {
  removers.forEach((removeListener) => removeListener());
  removers.clear();

  window.observers.forEach((observer) => observer.disconnect());
  window.observers.clear();

  const twigKeys = new Set();

  const commentPrefix = `START: /src/components`;

  const nodeIterator = document.createNodeIterator(
    root,
    NodeFilter.SHOW_COMMENT
  );
  let currentNode;
  while ((currentNode = nodeIterator.nextNode())) {
    const value = currentNode.nodeValue?.trim();
    if (value?.startsWith(commentPrefix)) {
      twigKeys.add(value.replace(RegExp(`^${commentPrefix}`), '.'));
    }
  }

  for (const twigKey of twigKeys) {
    const scriptModuleKeyJs = twigKey.replace(/twig$/, 'js');
    const scriptModuleKeyTs = twigKey.replace(/twig$/, 'ts');
    const scriptModule =
      scriptModules.get(scriptModuleKeyJs) ||
      scriptModules.get(scriptModuleKeyTs);

    const fn = scriptModule?.default;

    if (typeof fn === 'function') {
      console.log(
        `[STORYBOOK TWIG SCRIPT-RUNNER] executing ${
          fn.name || 'anonymous function'
        } for ${twigKey}`
      );
      fn();
    }
  }
}).observe(root, { childList: true, subtree: false });
