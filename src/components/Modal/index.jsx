import React, { Fragment, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import syles from './styles.css'

export default function Modal({ children, isOpen, close }) {
  if (!isOpen) return <Fragment />

  const wrapperRef = useRef()

  useEffect(() => {
    const onDocumentClick = (e) => {
      if (e.target !== wrapperRef.current || !close) return
      close()
    }
    document.addEventListener('click', onDocumentClick)
    return () => {
      document.removeEventListener('click', onDocumentClick)
    }
  })

  return (
    <div styleName="wrapper" ref={wrapperRef}>
      <div styleName="container">{children}</div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func,
}
