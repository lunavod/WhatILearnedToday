import React, { Fragment, useEffect, useRef } from 'react'
import { useObserver } from '../../utils/hooks'
import PropTypes from 'prop-types'

import styles from './styles.css'

export default function PostForm({
  title,
  setTitle,
  text,
  setText,
  originalText,
  setOriginalText,
  prefix,
}) {
  const contentRef = useRef(null)
  const originalContentRef = useRef(null)
  const editorRef = useRef(null)

  useObserver(contentRef, ['value'], () => {
    setText(contentRef.current.value)
    setOriginalText(originalContentRef.current.value)
  })

  useEffect(() => {
    let editor = editorRef.current
    if (originalText === originalContentRef.current.value) return
    editor.setText(originalText)
  }, [originalText])

  useEffect(() => {
    let editor = editorRef.current
    editor.originalOutputContainer = originalContentRef.current
    editor.outputContainer = contentRef.current
  })

  return (
    <div styleName="wrapper">
      <input
        type="text"
        styleName="title"
        placeholder="Дорогая принцесса Селестия..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input type="hidden" id={`${prefix}_content`} ref={contentRef} />
      <input
        type="hidden"
        id={`${prefix}_original_content`}
        ref={originalContentRef}
      />
      <baka-editor
        ref={editorRef}
        placeholder="Сегодня я точно напишу что-нибудь интересное!"
      />
    </div>
  )
}

PostForm.propTypes = {}
