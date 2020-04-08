// @flow

import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import PostForm from '../PostForm'
import Button from '../Button'
import Confirm from '../Confirm'

import styles from './styles.css'
import { editPost } from '../../api'

export default function EditPostModal({
  post,
  close,
}: {
  post: { title: string, text: string, original_text: string, id: number },
  close: () => {},
}) {
  const [title, setTitle] = useState(post.title)
  const [text, setText] = useState(post.text)
  const [originalText, setOriginalText] = useState(post.original_text)

  const [isCloseConfirmActive, setIsCloseConfirmActive] = useState(false)
  const [isResetConfirmActive, setIsResetConfirmActive] = useState(false)

  const onResetClick = () => {
    setIsResetConfirmActive(true)
  }

  const onPublishClick = async () => {
    console.log(originalText)
    await editPost(post.id, title, text, originalText)

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
      <div styleName="wrapper">
        <div styleName="edit">
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

          <div styleName="confirmations">
            {isResetConfirmActive && text !== post.text ? (
              <Confirm
                text="У вас есть несохраненные изменения. Вы уверены, что хотите их отменить?"
                onAccept={onResetAccept}
                onDeny={onResetDeny}
              />
            ) : (
              ''
            )}
            {isCloseConfirmActive && text !== post.text ? (
              <Confirm
                text="У вас есть несохраненные изменения. Вы уверены, что хотите завершить редактирование?"
                onAccept={onCloseAccept}
                onDeny={onCloseDeny}
              />
            ) : (
              ''
            )}
          </div>

          <div styleName="actions">
            <Button onClick={onResetClick} shadow accent round>
              <i className="fas fa-undo"></i>
            </Button>
            <Button
              onClick={onPublishClick}
              shadow
              round
              style={{ marginLeft: '24px' }}
            >
              <i className="fas fa-check"></i>
            </Button>
          </div>
        </div>
        <div styleName="preview">
          <div styleName="previewTitle">{title}</div>
          <div
            styleName="previewText"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>
    </Modal>
  )
}

EditPostModal.propTypes = {}
