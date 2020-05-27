// @flow

import React, { Fragment } from 'react'

import styles from './styles.css'
import { getPost } from '../../api'
import Post from '../../components/Post'
import { useBranch } from 'baobab-react/hooks'

export function Controller() {
  const { post } = useBranch({
    post: 'post',
  })

  if (!post) return <Fragment />

  return (
    <Fragment>
      <Post full post={post} />
    </Fragment>
  )
}

export async function loadData(tree, data) {
  tree.select('navbarItem').set('posts')

  const post = await getPost(data[1])
  tree.select('post').set(post)
  return true
}
