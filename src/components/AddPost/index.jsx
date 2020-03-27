import React, { Fragment, useState, useRef, useEffect } from 'react'
import Button from '../Button'

import syles from './styles.css'

export default function AddPost({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const publish = () => {
    onSubmit(title, text)
    setTitle('')
    setText('')

    let editor = editorRef.current
    editor.document.delete(0, editor.document.text.length)
    editor.document.history = []
  }

  const inputRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
    let target = inputRef.current

    const config = {
      attributes: true
    }

    const callback = (mutationList, observer) => {
      for (let mutation of mutationList) {
        if (mutation.attributeName === 'value') {
          setText(target.value)
        }
      }
    }

    const observer = new MutationObserver(callback)
    observer.observe(target, config)
  })

  return (
    <Fragment>
      <div styleName="wrapper">
        <input
          type="text"
          styleName="title"
          placeholder="Дорогая принцесса Селестия..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="hidden"
          id="content"
          onChange={console.log}
          ref={inputRef}
        />
        <baka-editor
          ref={editorRef}
          placeholder="Сегодня я точно напишу что-нибудь интересное!"
          output="#content"
        />
      </div>
      <div styleName="actions">
        <Button accent shadow>
          Сохранить
        </Button>
        <Button onClick={publish} shadow>
          Опубликовать
        </Button>
      </div>
    </Fragment>
  )
}
