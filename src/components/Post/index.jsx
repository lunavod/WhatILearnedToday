import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

export default function Post({ post }) {
  return (
    <div styleName="post">
      {post.title ? <header>{post.title}</header> : ''}
      {post.text ? (
        <div
          styleName="content"
          dangerouslySetInnerHTML={{ __html: post.text }}
        />
      ) : (
        ''
      )}
    </div>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired
}
