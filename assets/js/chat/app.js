/**
 * @jsx React.DOM
 */
var React = require('react');


var ChatApp = require('./component/ChatApp.react.js');

React.renderComponent(<ChatApp />, document.querySelector('#chat-ctn'));



// require('./demoModule/login');
