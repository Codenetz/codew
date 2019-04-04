import React from 'react';
import ReactDOM from 'react-dom';
import './common/style/common.styl';
import Example from './common/components/example';

class App extends React.Component {
  render() {
    let exampleArrowFunction = v => {
      console.log(v);
    };

    return (
      <div>
        <Example/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('react-container'));
