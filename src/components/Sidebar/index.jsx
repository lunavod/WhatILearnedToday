// @flow

import React, { useRef, useEffect, Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'
import FloatActions from '../FloatActions'

import styles from './styles.css'

export default function Sidebar() {
  const { loggedIn, dispatch } = useBranch({
    loggedIn: ['logInData', 'loggedIn'],
  })

  return (
    <div styleName="wrapper">
      <a href="/" styleName="logo">
        <div styleName="first_line">WHAT I</div>
        <div styleName="second_line">LEARNED</div>
        <div styleName="third_line">TODAY</div>
      </a>
      {loggedIn ? <FloatActions /> : ''}
    </div>
  )
}
