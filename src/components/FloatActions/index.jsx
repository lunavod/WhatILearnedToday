import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import styles from './styles.css'

export default function FloatActions() {
  const { dispatch } = useBranch({})

  return (
    <div styleName="wrapper">
      <div styleName="button">
        <i className="far fa-pencil" />
      </div>
    </div>
  )
}
