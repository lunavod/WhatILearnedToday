// @flow

import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import classNames from 'classnames'

import styles from './styles.css'

export default function Navbar() {
  const { logInData, dispatch } = useBranch({
    logInData: 'logInData',
  })

  const logOut = () => {
    dispatch((tree) => {
      tree.select('logInData').set({ id: 0, loggedIn: false, apiKey: '' })
    })
  }

  const logIn = () => {
    dispatch((tree) => {
      tree.select('modals', 'LoginActions', 'isOpen').set(true)
    })
  }

  const logged_items = (
    <Fragment>
      <NavbarItem name="settings">Настройки</NavbarItem>
      <NavbarItem onClick={logOut}>Выйти</NavbarItem>
    </Fragment>
  )

  const unlogged_items = (
    <Fragment>
      <NavbarItem onClick={logIn}>Войти</NavbarItem>
    </Fragment>
  )

  const logged_in = !!logInData.id

  return (
    <div styleName="navbar">
      <div>{logged_in ? logged_items : unlogged_items}</div>
      <div>
        <NavbarItem name="posts" href="/">
          Посты
        </NavbarItem>
        {/*<NavbarItem name="users">Пользователи</NavbarItem>*/}
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
