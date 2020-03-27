import React, { useRef, useEffect, Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'
import LoginActionsModal from '../LoginActionsModal'

import syles from './styles.css'

import fitty from 'fitty'

export default function Sidebar() {
  const refs = [useRef(), useRef(), useRef()]

  useEffect(() => {
    fitty(refs[0].current)
    fitty(refs[1].current)
    fitty(refs[2].current)
  })

  const { loggedIn, dispatch } = useBranch({
    loggedIn: ['currentUser', 'loggedIn']
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
      <div styleName="logo">
        <div ref={refs[0]}>WHAT I</div>
        <div ref={refs[1]}>LEARNED</div>
        <div ref={refs[2]}>TODAY</div>
      </div>
      {loggedIn ? '' : logged_items}
    </div>
  )
}
