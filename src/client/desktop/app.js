import React from 'react';
import ReactDOM from 'react-dom';
import "./common/style/common.styl";
import example from "./common/components/example"

class app extends React.Component {
  render() {

    let exampleArrowFunction = (v) => {
      console.log(v);
    };

    return (
      <div>
        <example />
      </div>
    )
  }
}

ReactDOM.render(<app />, document.getElementById('react-container'));