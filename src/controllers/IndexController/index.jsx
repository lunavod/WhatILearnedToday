import React, { Fragment } from 'react'
import Posts from '../../components/Posts'
import { getPosts } from '../../api'

import styles from './styles.css'
import Pagination from '../../components/Pagination'

export function Controller() {
  return (
    <Fragment>
      <Posts />
      <Pagination />
    </Fragment>
  )
}

export async function loadData(tree, data, params = {}) {
  tree.select('navbarItem').set('posts')

  const cursor = params.cursor || undefined
  const { posts, pagination } = await getPosts(cursor)
  tree.select('posts').set(posts)
  tree.select('pagination').set(pagination)
  return true
}

export const ControllerName = 'IndexController'
