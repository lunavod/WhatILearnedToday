// @flow

import React, { useState, useEffect } from 'react'
import { useBranch } from 'baobab-react/hooks'

import Button from '../../Button'
import PostForm from '../../PostForm'
import Confirm from '../../Confirm'
import PostPreview from '../../PostPreview'
import Modal from '../Modal'

import { addPost, getPosts } from '../../../api'

import styles from './styles.css'

export default function AddPostModal() {
  const { data, dispatch } = useBranch({
    data: ['modals', 'AddPostModal'],
  })

  const isOpen = data.isOpen

  const [title, setTitle] = useState(data.title)
  const [text, setText] = useState(data.text)
  const [originalText, setOriginalText] = useState(data.originalText)

  useEffect(() => {
    if (
      data.title === title &&
      data.text === text &&
      data.originalText === originalText
    )
      return

    dispatch((tree) => {
      tree.select('modals', 'AddPostModal').set({
        isOpen,
        title,
        text,
        originalText,
      })
    })
  })

  const [isCloseConfirmActive, setIsCloseConfirmActive] = useState(false)
  const [isResetConfirmActive, setIsResetConfirmActive] = useState(false)

  const close = () => {
    dispatch((tree) => {
      tree.select(['modals', 'AddPostModal', 'isOpen']).set(false)
    })
  }

  const onPublishClick = async () => {
    await addPost(title, text, originalText)
    const newPosts = await getPosts()
    dispatch((tree) => tree.select('posts').set(newPosts))
    setTitle('')
    setText('')
    setOriginalText('')
    close()
  }

  const onCloseClick = () => {
    if (!text.length) return close()
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
    if (!text.length && !title.length) return
    setIsResetConfirmActive(true)
  }

  const onResetAccept = () => {
    setTitle('')
    setText('')
    setOriginalText('')
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
        <div styleName="new">
          <PostForm
            {...{
              title,
              setTitle,
              text,
              setText,
              originalText,
              setOriginalText,
              prefix: 'new_',
            }}
          />

          <div styleName="confirmations">
            {isCloseConfirmActive && text.length && (
              <Confirm
                text="У вас есть несохраненные изменения. Вы уверены, что хотите закрыть окно?"
                onAccept={onCloseAccept}
                onDeny={onCloseDeny}
              />
            )}
            {isResetConfirmActive && text.length && (
              <Confirm
                text="У вас есть несохраненные изменения. Вы уверены, что хотите начать заново?"
                onAccept={onResetAccept}
                onDeny={onResetDeny}
              />
            )}
          </div>

          <div styleName="actions">
            <Button
              onClick={onCloseClick}
              shadow
              circle
              accent
              style={{ marginLeft: '12px' }}
            >
              <i className="fas fa-times" />
            </Button>
            <Button
              onClick={onResetClick}
              shadow
              circle
              accent
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
