import React, { Fragment, useEffect } from 'react'
import { useBranch } from 'baobab-react/hooks'
import Post from '../Post'

import syles from './styles.css'

export default function Posts() {
  const { posts, dispatch } = useBranch({
    posts: 'posts'
  })

  if (!posts) return <Fragment />

  return (
    <Fragment>
      {posts.map(post => (
        <Post post={post} key={`post_${post.id}`} />
      ))}
    </Fragment>
  )
}
