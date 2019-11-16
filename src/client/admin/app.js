import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import './modules/common/style/common.styl';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AuthProvider } from '../helpers/contexts/auth';
import thunk from 'redux-thunk';
import Routes from './routes';
import rootReducers from './store/rootReducers';

class App extends React.Component {
  render() {
    const store = createStore(rootReducers, applyMiddleware(thunk));

    return (
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <Routes/>
          </Router>
        </AuthProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('react-container'));
