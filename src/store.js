import Baobab from 'baobab'
import registerStored from './utils/BaobabStored'

const initialData = {
  logInData: {
    id: 0,
    loggedIn: false
  },
  currentUser: {},
  modals: {
    LoginActions: {
      isOpen: false,
      logIn: {
        username: 'TestUser',
        password: 'password'
      },
      register: {
        username: '',
        password: '',
        email: ''
      }
    }
  }
}

const tree = new Baobab(initialData)

const stored = [
  {
    path: ['logInData'],
    name: 'log_in_datar',
    duplicateToCookies: true
  }
]

registerStored(stored, tree)

export default tree
