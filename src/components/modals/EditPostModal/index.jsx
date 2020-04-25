// @flow

import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import PostForm from '../../PostForm'
import Button from '../../Button'
import Confirm from '../../Confirm'

import styles from './styles.css'
import { editPost } from '../../../api'
import PostPreview from '../../PostPreview'

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

  const onPublishClick = async () => {
    console.log(originalText)
    await editPost(post.id, title, text, originalText)

    setTitle('')
    setText('')
    setOriginalText('')

    close()
    location.reload()
  }

  const onCloseClick = () => {
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

  const onResetClick = () => {
    if (text === post.text && title === post.title) return
    setIsResetConfirmActive(true)
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
    <Modal
      isOpen={true}
      close={onCloseClick}
      style={{
        width: '100%',
        maxWidth: '1832px',
        minHeight: '200px',
        height: '100%',
      }}
    >
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
            {isResetConfirmActive && (
              <Confirm
                text="У вас есть несохраненные изменения. Вы уверены, что хотите их отменить?"
                onAccept={onResetAccept}
                onDeny={onResetDeny}
              />
            )}
            {isCloseConfirmActive && text !== post.text && (
              <Confirm
                text="У вас есть несохраненные изменения. Вы уверены, что хотите завершить редактирование?"
                onAccept={onCloseAccept}
                onDeny={onCloseDeny}
              />
            )}
          </div>

          <div styleName="actions">
            <Button onClick={onCloseClick} shadow accent circle>
              <i className="fas fa-times" />
            </Button>
            <Button
              onClick={onResetClick}
              shadow
              accent
              circle
              style={{ marginLeft: '12px' }}
            >
              <i className="fas fa-undo" />
            </Button>
            <Button
              onClick={onPublishClick}
              shadow
              circle
              style={{ marginLeft: '12px' }}
            >
              <i className="fas fa-check" />
            </Button>
          </div>
        </div>

        <div styleName="previewWrapper">
          <PostPreview title={title} text={text} />
        </div>
      </div>
    </Modal>
  )
}

EditPostModal.propTypes = {}
