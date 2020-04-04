import React, { Fragment, useState, useRef, useEffect } from 'react'
import Button from '../Button'

import syles from './styles.css'
import PostForm from '../PostForm'

export default function AddPost({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [originalText, setOriginalText] = useState('')

  const publish = () => {
    onSubmit(title, text, originalText)
    setTitle('')
    setText('')
    setOriginalText('')
  }

  return (
    <Fragment>
      <PostForm
        {...{
          title,
          setTitle,
          text,
          setText,
          originalText,
          setOriginalText,
          prefix: 'new',
        }}
      />
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
