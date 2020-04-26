// @flow

import React, { Fragment, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { deletePost, getPosts } from '../../api'
import { addNotification } from '../../actions/notifications'

import EditPostModal from '../modals/EditPostModal'
import Confirm from '../Confirm'

import styles from './styles.css'
import { useBranch } from 'baobab-react/hooks'
import classNames from 'classnames'

import PostContent from '../PostContent'
import Link from '../Link'

export default function Post({ post, full }: { post: any, full: boolean }) {
  const { dispatch, loggedIn } = useBranch({
    loggedIn: ['logInData', 'loggedIn'],
  })

  const user = post.creator || {}
  const [isConfirmShown, setIsConfirmShown] = useState(false)

  const onEditClick = (e) => {
    e.preventDefault()
    dispatch((tree) => {
      tree.select('modals', 'EditPostModal').set({
        isOpen: true,
        post,
      })
    })
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

  const isLong = !full && post.text.length > 700

  return (
    <Fragment>
      {isConfirmShown && (
        <Confirm
          text="Вы уверены что хотите удалить этот пост?"
          onAccept={onDeleteAccept}
          onDeny={onDeleteDeny}
        />
      )}
      <div
        className={classNames({
          [styles.post]: true,
          [styles.long]: isLong,
        })}
      >
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
            <Link href={`/posts/${post.id}`} className={styles.title}>
              <h1>{post.title}</h1>
            </Link>
            <Link href={`/users/${user.username}`} className={styles.username}>
              {user.username}
            </Link>
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
          <PostContent content={isLong ? post.text.slice(0, 800) : post.text} />
        </div>
        {isLong && (
          <Link href={`/posts/${post.id}`} className={styles.open_full}>
            Открыть полностью
          </Link>
        )}
      </div>
    </Fragment>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
}
