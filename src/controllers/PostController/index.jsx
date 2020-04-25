// @flow

import React, { Fragment } from 'react'

import { useBranch } from 'baobab-react/hooks'

import styles from './styles.css'
import { getPost, getPosts } from '../../api'
import Posts from '../../components/Posts'
import ShowPostModal from '../../components/modals/ShowPostModal'

export function Controller() {
  return (
    <Fragment>
      <ShowPostModal />
    </Fragment>
  )
}

export async function loadData(tree, data) {
  tree.select('navbarItem').set('posts')

  const post = await getPost(data[1])
  console.log('Post', post, data)
  tree.select('modals', 'ShowPostModal').set({ isOpen: true, post })
  return true
}
