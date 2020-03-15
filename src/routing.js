import * as IndexController from './controllers/IndexController'
import * as NotFoundController from './controllers/NotFoundController'

const routing = {
  '/': IndexController,

  404: NotFoundController
}

export default routing
