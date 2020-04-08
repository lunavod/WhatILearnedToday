import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'
import AddPost from '../../components/AddPost'
import Posts from '../../components/Posts'
import { getPosts, addPost } from '../../api'

import styles from './styles.css'

export function Controller() {
  const { loggedIn, dispatch } = useBranch({
    loggedIn: ['logInData', 'loggedIn'],
  })

  const publish = async (title, text, original_text) => {
    await addPost(title, text, original_text)
    const newPosts = await getPosts()
    dispatch((tree) => tree.select('posts').set(newPosts))
  }

  return (
    <Fragment>
      {/*{loggedIn ? <AddPost onSubmit={publish} /> : ''}*/}
      <Posts />
    </Fragment>
  )
}

export async function loadData(tree) {
  tree.select('navbarItem').set('posts')

  const posts = await getPosts()
  tree.select('posts').set(posts)
  return true
}

export const ControllerName = 'IndexController'
