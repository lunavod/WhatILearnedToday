// @flow

import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { deletePost, getPosts } from '../../api'
import { addNotification } from '../../actions/notifications'

import EditPostModal from '../EditPostModal'
import Confirm from '../Confirm'

import styles from './styles.css'
import { useBranch } from 'baobab-react/hooks'

import PostContent from '../PostContent'

export default function Post({ post }) {
  const { dispatch, loggedIn } = useBranch({
    loggedIn: ['logInData', 'loggedIn'],
  })

  const user = post.creator || {}
  const [isEditActive, setIsEditActive] = useState(false)
  const [isConfirmShown, setIsConfirmShown] = useState(false)

  const onEditClick = (e) => {
    e.preventDefault()
    setIsEditActive(true)
  }

  const onDeleteClick = async (e) => {
    e.preventDefault()
    setIsConfirmShown(!isConfirmShown)
  }

  const onDeleteAccept = async () => {
    await deletePost(post.id)
    const posts = await getPosts()
    dispatch((tree) => {
      tree.select('posts').set(posts)
    })
    dispatch(addNotification('Пост удален!'))
  }

  const onDeleteDeny = () => {
    setIsConfirmShown(false)
  }

  return (
    <Fragment>
      {isConfirmShown && (
        <Confirm
          text="Вы уверены что хотите удалить этот пост?"
          onAccept={onDeleteAccept}
          onDeny={onDeleteDeny}
        />
      )}
      <div styleName="post">
        <header>
          <img
            styleName="avatar"
            src={
              user.avatar_url
                ? globalThis.ENV.API + user.avatar_url
                : '/public/images/default_avatar.png'
            }
          />
          <div styleName="top_info_wrapper">
            <div styleName="title">{post.title}</div>
            <a href={`/users/${user.username}`} styleName="username">
              {user.username}
            </a>
          </div>
          <div styleName="actions">
            {loggedIn && (
              <Fragment>
                <a href="#" onClick={onDeleteClick}>
                  <i className="far fa-trash" />
                </a>
                <a href="#" onClick={onEditClick}>
                  <i className="far fa-edit" />
                </a>
              </Fragment>
            )}
          </div>
        </header>
        <div styleName="content">
          <PostContent content={post.text} />
        </div>
      </div>
      {isEditActive && (
        <EditPostModal post={post} close={() => setIsEditActive(false)} />
      )}
    </Fragment>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
}
