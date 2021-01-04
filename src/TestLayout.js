import go from 'gojs';

function TestLayout() {
  go.LayeredDigraphLayout.call(this);
  this.isViewportSized = true;
  this._wrap = NaN;
}
go.Diagram.inherit(TestLayout, go.LayeredDigraphLayout);

TestLayout.prototype.cloneProtected = function (copy) {
  go.LayeredDigraphLayout.prototype.cloneProtected.call(this, copy);
  copy._wrap = this._wrap;
};

Object.defineProperty(TestLayout.prototype, 'spacing', {
  get: function () {
    return this._spacing;
  },
  set: function (val) {
    if (!(val instanceof go.Size))
      throw new Error(
        'new value for SerpentineLayout.spacing must be a Size, not: ' + val,
      );
    if (!this._spacing.equals(val)) {
      this._spacing = val;
      this.invalidateLayout();
    }
  },
});

TestLayout.prototype.doLayout = function (coll) {
  go.LayeredDigraphLayout.prototype.doLayout.call(this, coll);

  const diagram = this.diagram;
  const parts = this.collectParts(coll);
  const { iterator } = parts;
  const spacing = this.layerSpacing;

  let root = null;
  let wrap = this.wrap;
  let breakNode = null;

  while (iterator.next()) {
    const node = iterator.value;
    if (!(node instanceof go.Node)) {
      continue;
    }
    if (root === null) {
      root = node;
    }
    if (!node.findLinksInto().count) {
      root = node;
      break;
    }
  }

  if (!root) {
    return;
  }

  if (diagram && isNaN(wrap)) {
    if (!this.group) {
      const { padding } = diagram;
      wrap = Math.max(
        spacing * 2,
        diagram.viewportBounds.width - 24 - padding.left - padding.right,
      );
    } else {
      wrap = 1000;
    }
  }

  if (diagram) {
    diagram.startTransaction('Test Layout');
  }

  while (iterator.next()) {
    const node = iterator.value;

    if (!(node instanceof go.Node)) {
      continue;
    }

    const nodeBound = this.getLayoutBounds(node);

    if (nodeBound.x > wrap) {
      if (!breakNode) {
        breakNode = node;
      }

      if (nodeBound.x < this.getLayoutBounds(breakNode).x) {
        breakNode = node;
      }
    }
  }

  /* const moveNode = ({ root, node }) => {
    const nodeBound = this.getLayoutBounds(node);

    if (root) {
      const rootBound = this.getLayoutBounds(root);
      node.move(new go.Point(rootBound.x, nodeBound.y + this.layerSpacing * 2));
    }

    node.findLinksOutOf().each(link => {
      const toNode = link.toNode;
      const toNodeBound = this.getLayoutBounds(toNode);

      toNode.move(
        new go.Point(
          nodeBound.x + this.layerSpacing,
          toNodeBound.y + this.layerSpacing * 2,
        ),
      );
      moveNode({ node: toNode });
    });
  };

  moveNode({ root, node: breakNode }); */

  /* 
  node.move(
    new go.Point(
      go.Point.parse(root.data.loc).x,
      nodeBound.y + this.layerSpacing * 2,
    ),
  );

  node.findLinksOutOf().each(link => {
    const toNode = link.toNode;
    const toNodeBound = this.getLayoutBounds(toNode);

    console.log(toNode.data, node.data.lineBreak);

    toNode.move(
      new go.Point(
        nodeBound.x + this.layerSpacing,
        toNodeBound.y + this.layerSpacing * 2,
      ),
    );
  }); */

  // node.findLinksInto().each(link => {
  //   if (!link.fromNode.data.lineBreak) {
  //     const toNode = link.toNode;
  //     const toNodeBound = this.getLayoutBounds(toNode);

  //     toNode.move(
  //       new go.Point(
  //         go.Point.parse(root.data.loc).x,
  //         toNodeBound.y + this.layerSpacing * 2,
  //       ),
  //     );
  //   }
  // });

  if (diagram) {
    diagram.commitTransaction('Test Layout');
  }
};

export default TestLayout;
