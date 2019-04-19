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
            <Tab selectedClassName={"active"}>speak</Tab>
          </TabList>
          {panels}
          <TabPanel>
            <Speak api={this.props.api} />
          </TabPanel>
        </Tabs>
        <div id="stop" className="button" onClick={() => this.stop()}>
          Stop
        </div>
      </div>
    );
  }
}

class Speak extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }

  speak(text) {
    console.log(this.props.api);
    axios.get(buildUrl(this.props.api, { path: "speak" }), {
      params: { text: text }
    });
  }
  render() {
    return (
      <div id="speak" className="panel">
        <input
          onChange={event => this.setState({ text: event.target.value })}
        />
        <div onClick={() => this.speak(this.state.text)} className="button">
          Speak
        </div>
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
      className="sample button"
      onClick={() =>
        axios.get(buildUrl(props.api, { path: "play" }), {
          params: { sample: props.sample }
        })
      }
    >
      <span>{name}</span>
    </div>
  );
}
