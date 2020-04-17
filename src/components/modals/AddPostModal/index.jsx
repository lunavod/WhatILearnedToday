// @flow

import React, { useState } from 'react'
import { useBranch } from 'baobab-react/hooks'

import Button from '../../Button'
import PostForm from '../../PostForm'
import Confirm from '../../Confirm'
import PostPreview from '../../PostPreview'
import Modal from '../Modal'

import { addPost, getPosts } from '../../../api'

import styles from './styles.css'

type PropTypes = {
  close: () => {},
}

export default function AddPost({ close }: PropTypes) {
  const { dispatch } = useBranch({})
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [originalText, setOriginalText] = useState('')

  const [isCloseConfirmActive, setIsCloseConfirmActive] = useState(false)

  const onPublishClick = async () => {
    await addPost(title, text, originalText)
    const newPosts = await getPosts()
    dispatch((tree) => tree.select('posts').set(newPosts))
    setTitle('')
    setText('')
    setOriginalText('')
    close()
  }

  const onClose = () => {
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

  return (
    <Modal
      isOpen={true}
      close={onClose}
      style={{ width: '100%', maxWidth: '1832px' }}
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
              prefix: `new_`,
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
          </div>

          <div styleName="actions">
            <Button
              onClick={onPublishClick}
              shadow
              circle
              style={{ marginLeft: '24px' }}
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
