import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'
import AddPost from '../../components/AddPost'
import Posts from '../../components/Posts'
import { getPosts, addPost } from '../../api'

import syles from './styles.css'

export function Controller() {
  const { dispatch } = useBranch({})

  const publish = async (title, text) => {
    await addPost(title, text)
    const newPosts = (await getPosts()).posts
    dispatch(tree => tree.select('posts').set(newPosts))
  }

  return (
    <Fragment>
      <AddPost onSubmit={publish} />
      <Posts />
    </Fragment>
  )
}

export async function loadData(tree) {
  const posts = (await getPosts()).posts
  tree.select('posts').set(posts)
  return true
}
