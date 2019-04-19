import React from "react";
import axios from "axios";
import buildUrl from "build-url";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./funboard.css";

export default class Funboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      samples: [],
      tabIndex: -1
    };
  }

  componentDidMount() {
    axios.get(buildUrl(this.props.api, { path: "samples" })).then(result => {
      this.setState({ samples: result.data, tabIndex: 0 });
    });
  }

  stop() {
    axios.get(buildUrl(this.props.api, { path: "stop" }));
    console.log("stop");
  }

  render() {
    const tabList = Object.keys(this.state.samples).map((sample, index) => (
      <Tab key={index} selectedClassName={"active"}>
        {sample.replace(/^.+\//, "")}
      </Tab>
    ));
    const panels = Object.keys(this.state.samples).map((sample, index) => (
      <TabPanel key={index}>
        <Panel
          name={sample}
          samples={this.state.samples[sample]}
          api={this.props.api}
        />
      </TabPanel>
    ));

    return (
      <div id="funboard">
        <Tabs
          selectedIndex={this.state.tabIndex}
          onSelect={tabIndex => this.setState({ tabIndex })}
        >
          <TabList className="tabList">
            {tabList}
            <li id="stop" onClick={() => this.stop()}>
              Stop
            </li>
          </TabList>
          {panels}
        </Tabs>
      </div>
    );
  }
}

function Panel(props) {
  const samples = props.samples.map((sample, index) => (
    <Sample key={index} sample={sample} api={props.api} />
  ));
  return <div className="panel">{samples}</div>;
}

function Sample(props) {
  var name = props.sample;
  // strip file extension
  name = name.replace(/\.[^/.]+$/, "");
  // strip folder name
  name = name.replace(/^.+\//, "");
  return (
    <div
      className="sample"
      onClick={() =>
        axios.get(buildUrl(props.api, { path: "play" }), {
          params: { sample: props.sample }
        })
      }
    >
      {name}
    </div>
  );
}
