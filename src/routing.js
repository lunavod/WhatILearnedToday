// @flow
import * as IndexController from './controllers/IndexController'
import * as NotFoundController from './controllers/NotFoundController'
import { getUser } from './api'

const routing = {
  '/': IndexController,

  '404': NotFoundController,
  default: {
    async loadData(tree: any) {
      if (!tree.select('logInData', 'loggedIn')) {
        console.log('Not logged in! D:')
        return
      }
      const user = await getUser(tree.select('logInData', 'id').get())
      tree.select(['currentUser']).set(user)
    }
  }
}

export default routing
