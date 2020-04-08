// @flow

import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import classNames from 'classnames'

import styles from './styles.css'

export default function Navbar() {
  const { navbarItem }: { navbarItem: string } = useBranch({
    navbarItem: ['navbarItem'],
  })

  return (
    <div styleName="navbar">
      <div>
        <a
          href="#"
          className={classNames({
            [styles.navbar_link]: true,
            [styles.active]: navbarItem === 'settings',
          })}
        >
          Настройки
        </a>
      </div>
      <div>
        <a
          href="#"
          className={classNames({
            [styles.navbar_link]: true,
            [styles.active]: navbarItem === 'posts',
          })}
        >
          Посты
        </a>
        <a
          href="#"
          className={classNames({
            [styles.navbar_link]: true,
            [styles.active]: navbarItem === 'users',
          })}
        >
          Пользователи
        </a>
      </div>
    </div>
  )
}
