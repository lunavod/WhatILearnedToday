// @flow

import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import classNames from 'classnames'
import { addNotification } from '../../actions/notifications'

import styles from './styles.css'
import Link from '../Link'

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

  const openInvitesModal = (e) => {
    e.preventDefault()
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
      <div styleName="separator" />
      <NavbarItem onClick={logOut}>Выйти</NavbarItem>
    </Fragment>
  )

  const unlogged_items = (
    <Fragment>
      <div styleName="separator" />
      <NavbarItem onClick={openLogInModal}>Войти</NavbarItem>
    </Fragment>
  )

  const logged_in = !!logInData.id

  return (
    <div styleName="wrapper">
      <div styleName="userbar">{logged_in ? logged_items : unlogged_items}</div>
      <div styleName="navbar">
        <Link href="/" className={styles.logo}>
          WHAT I LEARNED TODAY
        </Link>
        <div styleName="separator" />
        <div styleName="links">
          <NavbarItem name="posts" href="/">
            Посты
          </NavbarItem>
        </div>
      </div>
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
    <Link
      href={href || '#'}
      onClick={onClick}
      className={classNames({
        [styles.navbar_link]: true,
        [styles.active]: navbarItem === name,
      })}
    >
      {children}
    </Link>
  )
}
