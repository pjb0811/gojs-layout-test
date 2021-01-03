import go from 'gojs';

function LineBreakLayout() {
  go.TreeLayout.call(this);
  /* this._vertical = false;
  this._directionFunction = function (node) {
    return true;
  };
  this._bottomRightOptions = null;
  this._topLeftOptions = null; */
}
go.Diagram.inherit(LineBreakLayout, go.TreeLayout);

/* Object.defineProperty(LineBreakLayout.prototype, 'vertical', {
  get: function () {
    return this._vertical;
  },
  set: function (val) {
    if (typeof val !== 'boolean')
      throw new Error(
        'new value for LineBreakLayout.vertical must be a boolean value.'
      );
    if (this._vertical !== val) {
      this._vertical = val;
      this.invalidateLayout();
    }
  },
});

Object.defineProperty(LineBreakLayout.prototype, 'directionFunction', {
  get: function () {
    return this._directionFunction;
  },
  set: function (val) {
    if (typeof val !== 'function') {
      throw new Error(
        'new value for LineBreakLayout.directionFunction must be a function taking a node data object and returning a boolean.'
      );
    }
    if (this._directionFunction !== val) {
      this._directionFunction = val;
      this.invalidateLayout();
    }
  },
});

Object.defineProperty(LineBreakLayout.prototype, 'bottomRightOptions', {
  get: function () {
    return this._bottomRightOptions;
  },
  set: function (value) {
    if (this._bottomRightOptions !== value) {
      this._bottomRightOptions = value;
      this.invalidateLayout();
    }
  },
});

Object.defineProperty(LineBreakLayout.prototype, 'topLeftOptions', {
  get: function () {
    return this._topLeftOptions;
  },
  set: function (value) {
    if (this._topLeftOptions !== value) {
      this._topLeftOptions = value;
      this.invalidateLayout();
    }
  },
}); */

LineBreakLayout.prototype.cloneProtected = function (copy) {
  go.TreeLayout.prototype.cloneProtected.call(this, copy);
  /* copy._vertical = this._vertical;
  copy._directionFunction = this._directionFunction;
  copy._bottomRightOptions = this._bottomRightOptions;
  copy._topLeftOptions = this._topLeftOptions; */
};

LineBreakLayout.prototype.doLayout = function (coll) {
  coll = this.collectParts(coll);
  if (coll.count === 0) {
    return;
  }
  var diagram = this.diagram;
  if (diagram !== null) {
    diagram.startTransaction('Double Tree Layout');
  }

  var leftParts = new go.Set();
  var rightParts = new go.Set();
  this.separatePartsForLayout(coll, leftParts, rightParts);

  /* var layout1 = this.createTreeLayout(false);
  layout1.angle = this.vertical ? 270 : 180;
  layout1.arrangement = go.TreeLayout.ArrangementFixedRoots;
  layout1.doLayout(leftParts); */

  var layout2 = this.createTreeLayout(true);
  layout2.angle = this.vertical ? 90 : 0;
  layout2.arrangement = go.TreeLayout.ArrangementFixedRoots;
  layout2.doLayout(rightParts);

  if (diagram !== null) {
    diagram.commitTransaction('Double Tree Layout');
  }
};

LineBreakLayout.prototype.createTreeLayout = function (positive) {
  var lay = new go.TreeLayout();
  var opts = this.topLeftOptions;
  if (positive) opts = this.bottomRightOptions;
  if (opts)
    for (var p in opts) {
      lay[p] = opts[p];
    }
  return lay;
};

LineBreakLayout.prototype.separatePartsForLayout = function (
  coll,
  leftParts,
  rightParts
) {
  var root = null; // the one root
  var roots = new go.Set(); // in case there are multiple roots
  coll.each(function (node) {
    if (node instanceof go.Node && node.findTreeParentNode() === null)
      roots.add(node);
  });
  if (roots.count === 0) {
    // just choose the first node as the root
    var it = coll.iterator;
    while (it.next()) {
      if (it.value instanceof go.Node) {
        root = it.value;
        break;
      }
    }
  } else if (roots.count === 1) {
    // normal case: just one root node
    root = roots.first();
  } else {
    // multiple root nodes -- create a dummy node to be the one real root
    root = new go.Node(); // the new root node
    root.location = new go.Point(0, 0);
    var forwards = this.diagram ? this.diagram.isTreePathToChildren : true;
    // now make dummy links from the one root node to each node
    roots.each(function (child) {
      var link = new go.Link();
      if (forwards) {
        link.fromNode = root;
        link.toNode = child;
      } else {
        link.fromNode = child;
        link.toNode = root;
      }
    });
  }

  // the ROOT node is shared by both subtrees
  leftParts.add(root);
  rightParts.add(root);
  var lay = this;
  // look at all of the immediate children of the ROOT node
  root.findTreeChildrenNodes().each(function (child) {
    // in what direction is this child growing?
    // var bottomright = lay.isPositiveDirection(child);
    var coll = rightParts;
    // add the whole subtree starting with this child node
    coll.addAll(child.findTreeParts());
    // and also add the link from the ROOT node to this child node
    coll.add(child.findTreeParentLink());
  });
};

export default LineBreakLayout;
