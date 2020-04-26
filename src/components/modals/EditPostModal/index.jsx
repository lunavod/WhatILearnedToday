// @flow

import React, { Fragment, useRef, useEffect, useState } from 'react'

import Modal from '../Modal'
import PostForm from '../../PostForm'
import Button from '../../Button'
import Confirm from '../../Confirm'

import styles from './styles.css'
import { editPost } from '../../../api'
import PostPreview from '../../PostPreview'
import { useBranch } from 'baobab-react/hooks'

type PropTypes = {}

export default function EditPostModal() {
  const { post, isOpen, dispatch } = useBranch({
    post: ['modals', 'EditPostModal', 'post'],
    isOpen: ['modals', 'EditPostModal', 'isOpen'],
  })

  // if (!post) return <Fragment />

  const [title, setTitle] = useState(post.title)
  const [text, setText] = useState(post.text)
  const [originalText, setOriginalText] = useState(post.original_text)

  const [isCloseConfirmActive, setIsCloseConfirmActive] = useState(false)
  const [isResetConfirmActive, setIsResetConfirmActive] = useState(false)

  useEffect(() => {
    setTitle(post.title)
    setText(post.text)
    setOriginalText(post.original_text)
  }, [post.title, post.original_text, post.text])

  if (!originalText) return <Fragment />

  const close = () => {
    dispatch((tree) => {
      tree.select('modals', 'EditPostModal', 'isOpen').set(false)
    })
  }

  const onPublishClick = async () => {
    await editPost(post.id, title, text, originalText)

    setTitle('')
    setText('')
    setOriginalText('')

    close()
    window.Router.reload()
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
      isOpen={isOpen}
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
