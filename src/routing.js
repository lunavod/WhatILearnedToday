// @flow
import * as IndexController from './controllers/IndexController'
import * as NotFoundController from './controllers/NotFoundController'
import { getUser } from './api'

const routing = {
  '/': IndexController,

  '404': NotFoundController,
  default: {
    async loadData(tree: any) {
      if (!tree.select('logInData', 'loggedIn')) return
      const user = getUser(tree.logInData.id)
      tree.select(['currentUser']).set(user)
    }
  }
}

export default routing
