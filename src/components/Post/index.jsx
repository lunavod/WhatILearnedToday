import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getUser, deletePost } from '../../api'

import EditPostModal from '../EditPostModal'

import styles from './styles.css'

export default function Post({ post }) {
  const user = post.creator || {}
  const [isEditActive, setIsEditActive] = useState(false)

  const onEditClick = (e) => {
    e.preventDefault()
    setIsEditActive(true)
  }

  const onDeleteClick = async (e) => {
    e.preventDefault()
    await deletePost(post.id)
    location.reload()
  }

  return (
    <Fragment>
      <div styleName="post">
        <header>
          <img
            styleName="avatar"
            src={
              'https://skynetgaming.net/uploads/monthly_2020_03/Capture.thumb.PNG.7162eef397706a6f76dc1faf18b414c8.PNG'
            }
          />
          <div styleName="top_info_wrapper">
            <div styleName="title">{post.title}</div>
            <a href={`/user/${user.id}`} styleName="username">
              {user.username}
            </a>
          </div>
          <div styleName="actions">
            <a href="#" onClick={onDeleteClick}>
              <i className="far fa-trash"></i>
            </a>
            <a href="#" onClick={onEditClick}>
              <i className="far fa-edit"></i>
            </a>
          </div>
        </header>
        <div
          styleName="content"
          dangerouslySetInnerHTML={{ __html: post.text }}
        />
      </div>
      {isEditActive ? (
        <EditPostModal post={post} close={() => setIsEditActive(false)} />
      ) : (
        ''
      )}
    </Fragment>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
}
