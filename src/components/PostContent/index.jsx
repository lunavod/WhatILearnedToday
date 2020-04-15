// @flow

import React, { useRef, useEffect } from 'react'

import hljs from 'highlight.js'

import styles from './styles.css'

type PropTypes = {
  content: string,
}

export default function PostContent({ content }: PropTypes) {
  const contentRef = useRef()

  useEffect(() => {
    const wrapper = contentRef.current
    wrapper.querySelectorAll('.code').forEach((el) => {
      // el.innerHTML = `<div class="window">${el.innerHTML}</div>`
      setTimeout(() => hljs.highlightBlock(el), 0)
    })
  })

  return (
    <div
      ref={contentRef}
      styleName="content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
