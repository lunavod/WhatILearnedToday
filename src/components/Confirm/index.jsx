import React, { Fragment } from 'react'

import styles from './styles.css'

export default function Confirm({ text, onAccept, onDeny }) {
  return (
    <div styleName="wrapper">
      <div styleName="text">{text}</div>
      <div styleName="actions">
        <button styleName="deny" onClick={onDeny}>
          Нет
        </button>
        <button styleName="accept" onClick={onAccept}>
          Да
        </button>
      </div>
    </div>
  )
}
