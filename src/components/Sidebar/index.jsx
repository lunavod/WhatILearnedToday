// @flow

import React, { useRef, useEffect, Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'
import LoginActionsModal from '../LoginActionsModal'
import CurrentUser from '../CurrentUser'

import styles from './styles.css'

export default function Sidebar() {
  const { loggedIn, dispatch } = useBranch({
    loggedIn: ['logInData', 'loggedIn']
  })

  const onOpenClick = () => {
    dispatch(tree => {
      tree.select(['modals', 'LoginActions', 'isOpen']).set(true)
    })
  }

  const logged_items = (
    <Fragment>
      <div styleName="anonim_actions">
        <button styleName="open_login_form" onClick={onOpenClick}>
          <div styleName="left">Вход</div>
          <div styleName="right">Регистрация</div>
        </button>
      </div>
      <LoginActionsModal />
    </Fragment>
  )

  return (
    <div styleName="wrapper">
      <a href="/" styleName="logo">
        <div styleName="first_line">WHAT I</div>
        <div styleName="second_line">LEARNED</div>
        <div styleName="third_line">TODAY</div>
      </a>
      {loggedIn ? <CurrentUser /> : logged_items}
    </div>
  )
}
