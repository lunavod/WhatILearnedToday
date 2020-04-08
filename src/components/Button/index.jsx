// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import syles from './styles.css'

export default function Button({
  children,
  round,
  accent,
  secondary,
  shadow,
  style,
  onClick,
}: {
  children: {},
  round: boolean,
  accent: boolean,
  secondary: boolean,
  shadow: boolean,
  style: {},
  onClick: (e) => {},
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
        shadow,
      })}
    >
      {children}
    </button>
  )
}

Button.propTypes = {}
