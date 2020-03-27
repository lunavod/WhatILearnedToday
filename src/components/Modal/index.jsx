import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import syles from './styles.css'

export default function Modal({ children, isOpen }) {
  if (!isOpen) return <Fragment />
  return (
    <div styleName="wrapper">
      <div styleName="container">{children}</div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired
}
