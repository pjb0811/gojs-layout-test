import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import './App.css';

// import SerpentineLayout from './SerpentineLayout';
// import DoubleTreeLayout from './DoubleTreeLayout';
// import ParallelLayout from './ParallelLayout';
import LineBreakLayout from './LineBreakLayout';
// import SwimLaneLayout from './SwimLaneLayout';

function initDiagram() {
  const $ = go.GraphObject.make;
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  const diagram = $(go.Diagram, {
    'undoManager.isEnabled': true, // must be set to allow for model change listening
    /* layout: $(go.LayeredDigraphLayout, {
      // layerSpacing: 200,
      // setsPortSpots: false,
    }), */
    layout: $(LineBreakLayout, {
      layerSpacing: 300,
    }),
    model: $(go.GraphLinksModel, {
      linkKeyProperty: 'key',
    }),
  });

  // define a simple Node template
  diagram.nodeTemplate = $(
    go.Node,
    'Auto', // the Shape will go around the TextBlock
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    $(go.Shape, 'RoundedRectangle', {
      name: 'SHAPE',
      fill: 'lightblue',
      strokeWidth: 0,
    }),
    $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'text'))
  );

  diagram.linkTemplate = $(
    go.Link,
    { routing: go.Link.AvoidsNodes, corner: 10 },
    $(go.Shape),
    $(go.Shape, { toArrow: 'Standard' })
  );

  return diagram;
}

const nodes = [
  { key: -1, text: 'test1' },
  { key: -2, text: 'test2' },
  { key: -3, text: 'test3' },

  { key: 0, text: 'test4' },
  { key: 1, text: 'test5' },
  { key: 2, text: 'test6' },
  { key: 3, text: 'test7' },
  { key: 5, text: 'test8' },
  { key: 6, text: 'test9' },

  { key: 100, text: 'test10' },
  { key: 101, text: 'test11' },

  {
    key: 200,
    text: 'test12',
  },
  {
    key: 201,
    text: 'test13',
  },
  {
    key: 202,
    text: 'test14',
  },
];

const links = [
  { key: 300, from: -1, to: 0 },
  { key: 301, from: -2, to: 0 },
  { key: 302, from: -2, to: 3 },
  { key: 303, from: -3, to: 3 },
  { key: 304, from: 0, to: 1 },
  { key: 305, from: 1, to: 2 },
  { key: 306, from: 1, to: 3 },
  { key: 307, from: 0, to: 5 },
  { key: 308, from: 5, to: 3 },
  { key: 309, from: 3, to: 2 },

  { key: 310, from: 3, to: 6 },

  { key: 311, from: 2, to: 100 },
  { key: 312, from: 6, to: 101 },

  { key: 313, from: 0, to: 200 },
  { key: 314, from: 3, to: 201 },
  { key: 315, from: 2, to: 202 },
];

const onModelChange = (e) => {
  // console.log(e);
};

const App = () => {
  return (
    <div className="App">
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="diagram-component"
        nodeDataArray={nodes}
        linkDataArray={links}
        onModelChange={onModelChange}
      />
    </div>
  );
};

export default App;
