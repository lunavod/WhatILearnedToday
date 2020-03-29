// @flow

import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'
import { getUser, getUserPosts } from '../../api'

import Posts from '../../components/Posts'
import Profile from '../../components/Profile'

import syles from './styles.css'

export function Controller() {
  return (
    <Fragment>
      <Profile />
      <Posts />
    </Fragment>
  )
}

export async function loadData(tree: any, data: any) {
  tree.select('navbarItem').set('users')

  const userId = data[1]
  const user = await getUser(userId)
  const posts = await getUserPosts(user.username)

  tree.select('profile').set(user)
  tree.select('posts').set(posts)
}

export const ControllerName = 'ProfileController'
