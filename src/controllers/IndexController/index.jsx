import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'
import AddPost from '../../components/AddPost'
import Posts from '../../components/Posts'
import { getPosts, addPost } from '../../api'

import syles from './styles.css'

export function Controller() {
  const { loggedIn, dispatch } = useBranch({
    loggedIn: ['logInData', 'loggedIn']
  })

  const publish = async (title, text) => {
    await addPost(title, text)
    const newPosts = (await getPosts()).posts
    dispatch(tree => tree.select('posts').set(newPosts))
  }

  return (
    <Fragment>
      {loggedIn ? <AddPost onSubmit={publish} /> : ''}
      <Posts />
    </Fragment>
  )
}

export async function loadData(tree) {
  const posts = await getPosts()
  tree.select('posts').set(posts)
  return true
}
