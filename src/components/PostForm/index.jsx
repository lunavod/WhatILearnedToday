// @flow

import React, { Fragment, useEffect, useRef } from 'react'
import styles from './styles.css'
import './editor.global.css'

type PropTypes = {
  title: string,
  setTitle: (title: string) => {},

  setText: (text: string) => {},

  originalText: string,
  setOriginalText: (originalText: string) => {},
}

export default function PostForm({
  title,
  setTitle,
  setText,
  originalText,
  setOriginalText,
}: PropTypes) {
  const editorRef = useRef(null)

  useEffect(() => {
    let editor = editorRef.current
    if (originalText === editor.document.text) return
    editor.setText(originalText)
  }, [originalText])

  useEffect(() => {
    let editor = editorRef.current
    editor.addEventListener('change', (e) => {
      setText(e.detail.html)
      setOriginalText(e.detail.original)
    })
  })

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.title}
        placeholder="Дорогая принцесса Селестия..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <baka-editor
        ref={editorRef}
        placeholder="Сегодня я точно напишу что-нибудь интересное!"
      />
    </div>
  )
}
