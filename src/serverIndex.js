const template = require("ejs-loader!./templates/index.html.ejs")
const App = require('./components/App').default

const React = require('react')
const tree = require('./store').default
const routing = require('./routing').default

// module.exports = {test: 123}
module.exports = {template, App, React, tree, routing}