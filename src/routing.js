// @flow
import * as IndexController from './controllers/IndexController'
import * as ProfileController from './controllers/ProfileController'
import * as NotFoundController from './controllers/NotFoundController'
import * as PostController from './controllers/PostController'
import { getUser } from './api'

const defaultController = {
  async loadData(tree: any) {
    if (!tree.select('logInData', 'loggedIn').get()) {
      console.log('Not logged in! D:')
      return
    }
    const user = await getUser(tree.select('logInData', 'id').get())
    tree.select(['currentUser']).set(user)
  },
}

const routing = {
  '/$': IndexController,
  '/users/(.+)': ProfileController,
  '/posts/(.+)': PostController,

  '404': NotFoundController,
}

type Route = {
  Controller: React$Element,
  loadData: (tree, data) => {},
  data: Array<any>,
  default: {
    Controller: React$Element,
    loadData: (tree, data) => {},
    data: Array<any>,
  },
}

export default function getRouteForUrl(url: string): Route {
  console.log('Before', url)
  url = url.slice(0, url.indexOf('?') < 0 ? url.length : url.indexOf('?'))
  console.log('After', url)
  for (let pattern in routing) {
    const match = Array.from(url.match(new RegExp(pattern)) || [])
    if (!match.length) continue
    return { ...routing[pattern], data: match, default: defaultController }
  }

  return { ...routing['404'], data: [url], default: defaultController }
}
