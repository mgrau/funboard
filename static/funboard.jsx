import React from "react";
import axios from "axios";
import buildUrl from "build-url";

import "./funboard.css";

export default class Funboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      samples: []
    };
  }
  componentDidMount() {
    axios
      .get(buildUrl(this.props.api, { path: "samples" }))
      .then(result => this.setState({ samples: result.data }));
  }

  render() {
    const samples = this.state.samples.map((sample, index) => (
      <Sample key={index} sample={sample} api={this.props.api} />
    ));
    return <div id="funboard">{samples}</div>;
  }
}

function Sample(props) {
  return (
    <div
      className="sample"
      onClick={() =>
        axios.get(buildUrl(props.api, { path: "play/" + props.sample }))
      }
    >
      {props.sample}
    </div>
  );
}
