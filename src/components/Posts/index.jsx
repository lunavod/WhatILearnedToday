import React, { Fragment, useEffect } from 'react'
import { useBranch } from 'baobab-react/hooks'
import {} from 'lodash'

import syles from './styles.css'

export default function Posts() {
  const { posts, dispatch } = useBranch({
    posts: 'posts'
  })

  if (!posts) return <Fragment />

  return (
    <Fragment>
      {posts.map(post => {
        return (
          <div key={post.id}>
            <span>{post.title}</span>
            <p>{post.text}</p>
          </div>
        )
      })}
    </Fragment>
  )
}
