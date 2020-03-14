import ReactDOM from 'react-dom'
import React from 'react'
import Baobab from 'baobab'

import App from './components/App'

window.hydrateApp = (initialState) => {
  const tree = new Baobab(initialState)
  ReactDOM.hydrate(<App store={tree} />, document.querySelector('#react_container'))
}