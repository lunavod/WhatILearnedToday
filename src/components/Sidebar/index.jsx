// @flow

import React from 'react'

import styles from './styles.css'

export default function Sidebar() {
  return (
    <div styleName="wrapper">
      <a href="/" styleName="logo">
        <div styleName="first_line">WHAT I</div>
        <div styleName="second_line">LEARNED</div>
        <div styleName="third_line">TODAY</div>
      </a>
    </div>
  )
}
