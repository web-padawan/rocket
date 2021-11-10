import chai from 'chai';
import TreeModel from 'tree-model';

const { expect } = chai;

// const treeModel = new TreeModel({ modelComparatorFn });
const treeModel = new TreeModel();

function findParent(child, tree) {
  return tree.first(node => {
    return child.url.startsWith(node.model.url) && node.model.level === child.level - 1
  });
}

function pagesDataToTreeModel(data) {
  const sorted = [...data];
  sorted.sort((left, right) => {
    return left.level - right.level;
  });
  const tree = treeModel.parse(sorted.shift());

  for (const page of sorted) {
    const parent = findParent(page, tree);
    if (parent) {
      parent.addChild(treeModel.parse(page));
    }
  }
  return tree;
}

describe('pagesDataToTreeModel', () => {
  it('creates a root and adds pages', async () => {
    const expected = treeModel.parse({
      level: 0,
      h1: 'This is Home',
      menuLinkText: 'Home',
      url: '/',
      outputRelativeFilePath: 'index.html',
      sourceRelativeFilePath: 'index.rocket.js',
      children: [
        {
          h1: 'This is About',
          menuLinkText: 'About',
          url: '/about/',
          level: 1,
          outputRelativeFilePath: 'about/index.html',
          sourceRelativeFilePath: 'about.rocket.js',
        },
        {
          h1: 'This is Components',
          menuLinkText: 'Components',
          url: '/components/',
          level: 1,
          outputRelativeFilePath: 'components/index.html',
          sourceRelativeFilePath: 'components.rocket.js',
        },
      ],
    });

    const actual = pagesDataToTreeModel([
      {
        sourceRelativeFilePath: 'about.rocket.js',
        outputRelativeFilePath: 'about/index.html',
        url: '/about/',
        level: 1,
        menuLinkText: 'About',
        h1: 'This is About',
      },
      {
        sourceRelativeFilePath: 'index.rocket.js',
        outputRelativeFilePath: 'index.html',
        url: '/',
        level: 0,
        menuLinkText: 'Home',
        h1: 'This is Home',
      },
      {
        sourceRelativeFilePath: 'components.rocket.js',
        outputRelativeFilePath: 'components/index.html',
        url: '/components/',
        level: 1,
        menuLinkText: 'Components',
        h1: 'This is Components',
      },
    ]);

    expect(actual).to.deep.equal(expected);
  });

  it('pagesDataToTreeModel', async () => {
    const expected = treeModel.parse({
      level: 0,
      h1: 'This is Home',
      menuLinkText: 'Home',
      url: '/',
      outputRelativeFilePath: 'index.html',
      sourceRelativeFilePath: 'index.rocket.js',
      children: [
        {
          sourceRelativeFilePath: 'components/index.rocket.js',
          outputRelativeFilePath: 'components/index.html',
          url: '/components/',
          level: 1,
          menuLinkText: 'Components',
          h1: 'This is Components',
          children: [
            {
              sourceRelativeFilePath: 'components/tabs.rocket.js',
              outputRelativeFilePath: 'components/tabs/index.html',
              url: '/components/tabs/',
              level: 2,
              menuLinkText: 'Tabs',
              h1: 'This is Tabs',
            },
            {
              sourceRelativeFilePath: 'components/accordion.rocket.js',
              outputRelativeFilePath: 'components/accordion/index.html',
              url: '/components/accordion/',
              level: 2,
              menuLinkText: 'Accordion',
              h1: 'This is Accordion',
            },
          ],
        },
      ],
    });

    const actual = pagesDataToTreeModel([
      {
        sourceRelativeFilePath: 'components/tabs.rocket.js',
        outputRelativeFilePath: 'components/tabs/index.html',
        url: '/components/tabs/',
        level: 2,
        menuLinkText: 'Tabs',
        h1: 'This is Tabs',
      },
      {
        sourceRelativeFilePath: 'components/accordion.rocket.js',
        outputRelativeFilePath: 'components/accordion/index.html',
        url: '/components/accordion/',
        level: 2,
        menuLinkText: 'Accordion',
        h1: 'This is Accordion',
      },
      {
        sourceRelativeFilePath: 'index.rocket.js',
        outputRelativeFilePath: 'index.html',
        url: '/',
        level: 0,
        menuLinkText: 'Home',
        h1: 'This is Home',
      },
      {
        sourceRelativeFilePath: 'components/index.rocket.js',
        outputRelativeFilePath: 'components/index.html',
        url: '/components/',
        level: 1,
        menuLinkText: 'Components',
        h1: 'This is Components',
      },
    ]);

    expect(actual).to.deep.equal(expected);
  });
});
