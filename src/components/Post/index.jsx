import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getUser } from '../../api'

import styles from './styles.css'

export default function Post({ post }) {
  const user = post.creator || {}

  return (
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
          <div styleName="username">{user.username}</div>
        </div>
      </header>
      <div
        styleName="content"
        dangerouslySetInnerHTML={{ __html: post.text }}
      />
    </div>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired
}
