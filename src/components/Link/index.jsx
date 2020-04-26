// @flow

import React, { useEffect, useRef } from 'react'

import styles from './styles.css'

type PropTypes = {
  href: string,
}

export default function Link(props: PropTypes) {
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      e.preventDefault()
      window.Router.goTo(props.href)
    }
    ref.current.addEventListener('click', onClick)

    return () => {
      ref.current.removeEventListener('click', onClick)
    }
  })

  return <a {...props} ref={ref} />
}
