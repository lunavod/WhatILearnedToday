// @flow

import React, { useRef, useEffect, useState } from 'react'

import Worker from '../../utils/highlight.worker'

import styles from './styles.css'

type PropTypes = {
  content: string,
}

function checkArrayEquality(a: Array<any>, b: Array<any>) {
  if (a.length !== b.length) return false
  return !a.filter((el) => b.indexOf(el) < 0).length
}

export default function PostContent({ content }: PropTypes) {
  const contentRef = useRef()

  const [codeNodes, setCodeNodes] = useState([])

  useEffect(() => {
    const wrapper = contentRef.current
    const timerId = setInterval(() => {
      const newNodes = Array.from(wrapper.querySelectorAll('.code'))
      if (
        !checkArrayEquality(
          codeNodes,
          newNodes.map((node) => node.innerText)
        )
      ) {
        newNodes.forEach((el) => {
          const worker = new Worker('worker.js')
          worker.onmessage = (event) => {
            el.innerHTML = event.data.replace(/\n/gm, '<br/>')
          }
          worker.postMessage(el.innerText)
        })
        setCodeNodes(newNodes.map((node) => node.innerText))
      }
    }, 10)
    return () => clearInterval(timerId)
  })

  return (
    <div
      ref={contentRef}
      styleName="content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
