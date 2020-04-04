import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import PostForm from '../PostForm'
import Button from '../Button'

import styles from './styles.css'
import { editPost } from '../../api'

export default function EditPostModal({ post, close }) {
  const [title, setTitle] = useState(post.title)
  const [text, setText] = useState(post.text)
  const [originalText, setOriginalText] = useState(post.original_text)

  const editorRef = useRef()

  const reset = () => {
    setTitle(post.title)
    setText(post.text)
    setOriginalText(post.original_text)
  }

  const mySetOriginalText = (text) => {
    console.log('Set original:', text)
    setOriginalText(text)
  }

  const publish = () => {
    console.log(originalText)
    editPost(post.id, title, text, originalText)

    setTitle('')
    setText('')
    setOriginalText('')

    close()
    location.reload()
  }

  return (
    <Modal isOpen={true} close={close}>
      <div styleName="wrapper">
        <PostForm
          {...{
            title,
            setTitle,
            text,
            setText,
            originalText,
            setOriginalText: mySetOriginalText,
            prefix: `edit_${post.id}`,
          }}
        />
      </div>
      <div styleName="actions">
        <Button onClick={reset} shadow accent>
          Сбросить
        </Button>
        <Button onClick={publish} shadow>
          Опубликовать
        </Button>
      </div>
    </Modal>
  )
}

EditPostModal.propTypes = {}
