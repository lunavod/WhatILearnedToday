import storage from './BetterLocalStorage'

import forEach from 'lodash/forEach'
import isArray from 'lodash/isArray'
import isEqual from 'lodash/isEqual'
import Cookies from 'js-cookie'

/**
 * Register elements from baobab tree to be stored in localStorage
 *
 * @param {object} stored Config
 * @param {object} tree Baobab tree
 */
export default function registerStored(stored, tree) {
  forEach(stored, (options) => {
    if (isArray(options))
      options = {
        path: options,
      }
    if (!options.name) options.name = options.path.join('__')

    console.log(options)
    const watcher = tree.watch({
      target: options.path,
    })

    let val = storage.get(`__stored_${options.name}`, {
      model: options.model,
    })

    if (val) {
      tree.select(options.path).set(val)
    } else {
      val = tree.select(options.path).get()
      storage.set(`__stored_${options.name}`, val)
      // if (options.duplicateToCookies)
      Cookies.set(`__stored_${options.name}`, JSON.stringify(val))
    }

    watcher.on('update', () => {
      const newVal = tree.select(options.path).get()
      storage.set(`__stored_${options.name}`, newVal)
      if (options.duplicateToCookies)
        Cookies.set(`__stored_${options.name}`, JSON.stringify(val))
    })

    storage.listenChange(`__stored_${options.name}`, (val) => {
      val = storage.get(`__stored_${options.name}`, {
        model: true,
      })
      if (
        !isEqual(
          JSON.stringify(val),
          JSON.stringify(tree.select(options.path).get())
        )
      ) {
        tree.select(options.path).set(val)
      }
    })
  })
}
