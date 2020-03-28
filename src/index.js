import ReactDOM from 'react-dom'
import React from 'react'
import Baobab from 'baobab'

require('./utils/BakaEditor/index.js')
import registerStored from './utils/BaobabStored'

import App from './components/App'

window.hydrateApp = initialState => {
  const tree = new Baobab(initialState)
  const stored = [
    {
      path: ['logInData'],
      name: 'log_in_data',
      duplicateToCookies: true
    }
  ]

  registerStored(stored, tree)

  const watcher = tree.watch({
    target: 'logInData'
  })

  watcher.on('update', () => {
    const newVal = tree.select('logInData').get().api_key
    globalThis.api_key = newVal
  })

  window.tree = tree
  document.addEventListener('baobabExtensionReady', () => {
    console.log('Register event fired')
    registerBaobabStore(tree, 'store')
  })
  if (window.registerBaobabStore !== undefined)
    registerBaobabStore(tree, 'store')
  ReactDOM.hydrate(
    <App store={tree} />,
    document.querySelector('#react_container')
  )
}
