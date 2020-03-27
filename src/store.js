import Baobab from 'baobab'

const initialData = {
  currentUser: {
    id: 0,
    loggedIn: false
  },
  modals: {
    LoginActions: {
      isOpen: true,
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

export default tree
