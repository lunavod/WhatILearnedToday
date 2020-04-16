// @flow
import * as IndexController from './controllers/IndexController'
import * as ProfileController from './controllers/ProfileController'
import * as NotFoundController from './controllers/NotFoundController'
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

  '404': NotFoundController,
}

export default function getRouteForUrl(url: string): any {
  for (let pattern in routing) {
    const match = Array.from(url.match(new RegExp(pattern)) || [])
    if (!match.length) continue
    return { ...routing[pattern], data: match, default: defaultController }
  }

  return { ...routing['404'], data: [url], default: defaultController }
}
