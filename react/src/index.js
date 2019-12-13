import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware  } from 'redux'
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css';
import App from './App';
import Create from './Create.jsx';
import Login from './Login.jsx';
import Edit from './Edit';
import Reducer from './store';

const store = createStore(Reducer, applyMiddleware(thunk));
ReactDOM.render(
    <Provider store={store}>
        <Router >

                <Switch>
                    <Route exact  path="/" component={App} />
                    <Route path="/create" component={Create} />
                    <Route path="/login" component={Login} />
                    <Route path="/edit/:id" component={Edit} />
                </Switch>
        </Router>
        
    </Provider>
  , document.getElementById('root'));
