import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import syles from './styles.css'

export default function Button({
  children,
  round,
  accent,
  secondary,
  style,
  onClick,
  shadow
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      styleName={classNames({
        button: true,
        round,
        accent,
        secondary,
        shadow
      })}
    >
      {children}
    </button>
  )
}

Button.propTypes = {}
