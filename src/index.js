import ReactDOM from 'react-dom'
import React from 'react'
import Baobab from 'baobab'
import { stored } from './store'
import Router from './utils/router'

require('./utils/BakaEditor/src/index.js')
import registerStored from './utils/BaobabStored'

import App from './components/App'

window.hydrateApp = (initialState) => {
  globalThis.Router = new Router()

  const tree = new Baobab(initialState)

  registerStored(stored, tree)

  const watcher = tree.watch({
    target: 'logInData',
  })

  watcher.on('update', () => {
    const newVal = tree.select('logInData').get().api_key
    globalThis.api_key = newVal
  })

  const modalWatcher = tree.watch({ target: 'modals' })

  modalWatcher.on('update', () => {
    const modals = tree.select('modals').get()
    let isOpen = false
    Object.keys(modals).forEach((modalName) => {
      const modal = modals[modalName]
      if (modal.isOpen) isOpen = true
    })

    if (document.body.classList.contains('no-scroll') && !isOpen) {
      document.body.classList.remove('no-scroll')
    } else if (!document.body.classList.contains('no-scroll') && isOpen) {
      document.body.classList.add('no-scroll')
    }
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

  document.querySelector('script#starter').remove()
}
