// @flow

import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'
import { getUser, getUserPosts } from '../../api'

import Posts from '../../components/Posts'
import Profile from '../../components/Profile'
import EditProfile from '../../components/EditProfile'

import styles from './styles.css'
import Pagination from '../../components/Pagination'

export function Controller() {
  const { currentUser, profile, posts, dispatch } = useBranch({
    currentUser: 'currentUser',
    profile: 'profile',
    posts: 'posts',
  })

  if (!profile) return <Fragment />

  const limit = 10

  const loadMore = async () => {
    const cursor = new Date(posts[posts.length - 1].created_at).getTime()
    const newPosts = await getUserPosts(profile.username, cursor, limit)
    dispatch((tree) => {
      tree.select('posts').set(newPosts)
    })
  }

  return (
    <Fragment>
      {currentUser && currentUser.id === profile.id ? (
        <EditProfile />
      ) : (
        <Profile />
      )}
      <Posts />
      <Pagination loadMore={loadMore} />
    </Fragment>
  )
}

export async function loadData(tree: any, data: any) {
  tree.select('navbarItem').set('users')

  const userId = data[1]
  const user = await getUser(userId)
  const { posts, pagination } = await getUserPosts(user.username)

  tree.select('profile').set(user)
  tree.select('posts').set(posts)
  tree.select('pagination').set(pagination)
}

export const ControllerName = 'ProfileController'
