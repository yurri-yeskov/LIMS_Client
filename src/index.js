import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import 'core-js';
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import axios from 'axios';
import App from './App';
import { icons } from './assets/icons'
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import './index.css';

import store from './store/index'

React.icons = icons

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status === 401) {
    window.location.href = "/#/login";
  }
  return Promise.reject(error);
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
