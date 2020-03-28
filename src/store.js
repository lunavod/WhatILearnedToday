import Baobab from 'baobab'
import registerStored from './utils/BaobabStored'

const initialData = {
  currentUser: {
    id: 0,
    loggedIn: false
  },
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
    path: ['currentUser'],
    name: 'current_user',
    duplicateToCookies: true
  }
]

registerStored(stored, tree)

export default tree
