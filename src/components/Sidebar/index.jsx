// @flow

import React from 'react'

import styles from './styles.css'
import Link from '../Link'

export default function Sidebar() {
  return (
    <div styleName="wrapper">
      <Link href="/" className={styles.logo}>
        <div styleName="first_line">WHAT I</div>
        <div styleName="second_line">LEARNED</div>
        <div styleName="third_line">TODAY</div>
      </Link>
    </div>
  )
}
