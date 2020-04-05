import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import PostForm from '../PostForm'
import Button from '../Button'
import Confirm from '../Confirm'

import styles from './styles.css'
import { editPost } from '../../api'

export default function EditPostModal({ post, close }) {
  const [title, setTitle] = useState(post.title)
  const [text, setText] = useState(post.text)
  const [originalText, setOriginalText] = useState(post.original_text)

  const [isCloseConfirmActive, setIsCloseConfirmActive] = useState(false)
  const [isResetConfirmActive, setIsResetConfirmActive] = useState(false)

  const editorRef = useRef()

  const onResetClick = () => {
    setIsResetConfirmActive(true)
  }

  const onPublishClick = () => {
    console.log(originalText)
    editPost(post.id, title, text, originalText)

    setTitle('')
    setText('')
    setOriginalText('')

    close()
    location.reload()
  }

  const onClose = () => {
    if (text === post.text) return close()
    setIsCloseConfirmActive(true)
  }

  const onCloseAccept = () => {
    setIsCloseConfirmActive(false)
    close()
  }

  const onCloseDeny = () => {
    setIsCloseConfirmActive(false)
  }

  const onResetAccept = () => {
    setIsResetConfirmActive(false)
    setTitle(post.title)
    setText(post.text)
    setOriginalText(post.original_text)
  }

  const onResetDeny = () => {
    setIsResetConfirmActive(false)
  }

  return (
    <Modal isOpen={true} close={onClose}>
      {isCloseConfirmActive && text !== post.text ? (
        <Confirm
          text="У вас есть несохраненные изменения. Вы уверены, что хотите завершить редактирование?"
          onAccept={onCloseAccept}
          onDeny={onCloseDeny}
        />
      ) : (
        ''
      )}
      <div styleName="wrapper">
        <PostForm
          {...{
            title,
            setTitle,
            text,
            setText,
            originalText,
            setOriginalText,
            prefix: `edit_${post.id}`,
          }}
        />
      </div>
      {isResetConfirmActive && text !== post.text ? (
        <Confirm
          text="У вас есть несохраненные изменения. Вы уверены, что хотите их отменить?"
          onAccept={onResetAccept}
          onDeny={onResetDeny}
        />
      ) : (
        ''
      )}
      <div styleName="actions">
        <Button onClick={onResetClick} shadow accent>
          Сбросить
        </Button>
        <Button onClick={onPublishClick} shadow>
          Опубликовать
        </Button>
      </div>
    </Modal>
  )
}

EditPostModal.propTypes = {}
