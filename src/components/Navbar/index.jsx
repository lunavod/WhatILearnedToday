// @flow

import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import classNames from 'classnames'

import styles from './styles.css'

export default function Navbar() {
  const { navbarItem }: { navbarItem: string } = useBranch({
    navbarItem: ['navbarItem']
  })

  return (
    <div styleName="navbar">
      <div>
        <a
          href="#"
          className={classNames({
            [styles.navbar_link]: true,
            [styles.active]: navbarItem === 'posts'
          })}
        >
          <i className="fal fa-book"></i>
        </a>
        <a
          href="#"
          className={classNames({
            [styles.navbar_link]: true,
            [styles.active]: navbarItem === 'users'
          })}
        >
          <i className="fal fa-users"></i>
        </a>
      </div>
      <div>
        <a
          href="#"
          className={classNames({
            [styles.navbar_link]: true,
            [styles.active]: navbarItem === 'settings'
          })}
        >
          <i className="fal fa-cogs"></i>
        </a>
      </div>
    </div>
  )
}
