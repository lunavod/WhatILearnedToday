import Baobab from 'baobab'
import registerStored from './utils/BaobabStored'

const initialData = {
  logInData: {
    id: 0,
    loggedIn: false,
  },
  currentUser: {},
  navbarItem: '',
  modals: {
    LoginActions: {
      isOpen: false,
      logIn: {
        username: '',
        password: '',
      },
      register: {
        username: '',
        password: '',
        email: '',
        invite: '',
      },
    },
    InvitesModal: {
      isOpen: false,
      invites: [],
    },
  },
  notifications: [],
}

const tree = new Baobab(initialData)

const stored = [
  {
    path: ['logInData'],
    name: 'log_in_data',
    duplicateToCookies: true,
  },
]

registerStored(stored, tree)

export default tree
