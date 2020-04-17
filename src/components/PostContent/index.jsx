// @flow

import React, { useRef, useEffect } from 'react'

import Worker from '../../utils/highlight.worker'

import styles from './styles.css'

type PropTypes = {
  content: string,
}

export default function PostContent({ content }: PropTypes) {
  const contentRef = useRef()

  useEffect(() => {
    const wrapper = contentRef.current
    wrapper.querySelectorAll('.code').forEach((el) => {
      const worker = new Worker('worker.js')
      worker.onmessage = (event) => {
        el.innerHTML = event.data
      }
      worker.postMessage(el.innerHTML.replace(/<br>/gm, '\n'))
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
