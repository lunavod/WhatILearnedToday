// @flow

import React, { Fragment, useEffect, useRef } from 'react'

import styles from './styles.css'

type PropTypes = {
  children: {},
  isOpen: boolean,
  close: () => {},
  style?: {},
}

export default function Modal({ children, isOpen, close, style }: PropTypes) {
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
      <div styleName="container" style={style}>
        {children}
      </div>
    </div>
  )
}
