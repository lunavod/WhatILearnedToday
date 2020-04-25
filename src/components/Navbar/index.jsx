// @flow

import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import classNames from 'classnames'
import { addNotification } from '../../actions/notifications'

import styles from './styles.css'

export default function Navbar() {
  const { logInData, currentUser, dispatch } = useBranch({
    logInData: 'logInData',
    currentUser: 'currentUser',
  })

  const logOut = () => {
    dispatch((tree) => {
      tree.select('logInData').set({ id: 0, loggedIn: false, apiKey: '' })
      tree.select('currentUser').set({})
    })

    localStorage.setItem('api_key', '')
    localStorage.setItem('session_id', 0)
    localStorage.setItem('current_user_id', 0)

    dispatch(addNotification('Выход из аккаунта выполнен успешно'))
  }

  const openLogInModal = () => {
    dispatch((tree) => {
      tree.select('modals', 'LoginActions', 'isOpen').set(true)
    })
  }

  const openInvitesModal = () => {
    dispatch((tree) => {
      tree.select('modals', 'InvitesModal', 'isOpen').set(true)
    })
  }

  const logged_items = (
    <Fragment>
      <NavbarItem name="settings" href={`/users/${currentUser.username}`}>
        Профиль
      </NavbarItem>
      <NavbarItem onClick={openInvitesModal}>Управление инвайтами</NavbarItem>
      <NavbarItem onClick={logOut}>Выйти</NavbarItem>
    </Fragment>
  )

  const unlogged_items = (
    <Fragment>
      <NavbarItem onClick={openLogInModal}>Войти</NavbarItem>
    </Fragment>
  )

  const logged_in = !!logInData.id

  return (
    <div styleName="navbar">
      {logged_in ? logged_items : unlogged_items}
      <div styleName="separator" />
      <NavbarItem name="posts" href="/">
        Посты
      </NavbarItem>
      {/*<NavbarItem name="users">Пользователи</NavbarItem>*/}
    </div>
  )
}

function NavbarItem({
  name,
  href,
  onClick,
  children,
}: {
  name?: string,
  href?: string,
  onClick?: (e) => {},
  children: {},
}) {
  const { navbarItem }: { navbarItem: string } = useBranch({
    navbarItem: ['navbarItem'],
  })
  return (
    <a
      href={href || '#'}
      onClick={onClick}
      className={classNames({
        [styles.navbar_link]: true,
        [styles.active]: navbarItem === name,
      })}
    >
      {children}
    </a>
  )
}
