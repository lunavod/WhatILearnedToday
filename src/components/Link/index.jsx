// @flow

import React, { useEffect, useRef } from 'react'

import encodeQueryData from '../../utils/query'

import styles from './styles.css'

type PropTypes = {
  href: string,
  params?: {},
  onClick?: (e: MouseEvent) => {},
}

export default function Link(props: PropTypes) {
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (props.onClick) return
      e.preventDefault()
      window.Router.goTo(props.href, props.params)
    }
    ref.current.addEventListener('click', onClick)

    return () => {
      ref.current.removeEventListener('click', onClick)
    }
  })

  return (
    <a
      {...{ ...props, href: props.href + encodeQueryData(props.params || {}) }}
      ref={ref}
    />
  )
}
