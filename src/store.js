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
    AddPostModal: {
      isOpen: false,
      title: '',
      text: '',
      originalText: '',
    },
    ShowPostModal: {
      isOpen: false,
      post: {},
    },
  },
  notifications: [],
}

const tree = new Baobab(initialData)

export const stored = [
  {
    path: ['logInData'],
    name: 'log_in_data',
    duplicateToCookies: true,
  },
  {
    path: ['modals', 'AddPostModal', 'title'],
    name: 'add_post_modal__title',
    duplicateToCookies: true,
  },
  {
    path: ['modals', 'AddPostModal', 'text'],
    name: 'add_post_modal__text',
  },
  {
    path: ['modals', 'AddPostModal', 'originalText'],
    name: 'add_post_modal__original_text',
  },
]

registerStored(stored, tree)

export default tree
