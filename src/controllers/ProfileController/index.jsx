// @flow

import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'
import { getUser, getUserPosts } from '../../api'

import Posts from '../../components/Posts'
import Profile from '../../components/Profile'
import EditProfile from '../../components/EditProfile'

import styles from './styles.css'

export function Controller() {
  const { currentUser, profile } = useBranch({
    currentUser: 'currentUser',
    profile: 'profile',
  })
  return (
    <Fragment>
      {currentUser && currentUser.id === profile.id ? (
        <EditProfile />
      ) : (
        <Profile />
      )}
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
