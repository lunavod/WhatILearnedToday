// @flow

import React, { Fragment } from 'react'

import { useBranch } from 'baobab-react/hooks'

import styles from './styles.css'
import { getPosts } from '../../api'

export default function Pagination() {
  const { pagination, dispatch } = useBranch({
    pagination: 'pagination',
  })

  const loadMore = async (e) => {
    e.preventDefault()
    const data = await getPosts(pagination.next_cursor, pagination.limit)
    dispatch((tree) => {
      tree.concat('posts', data.posts)
      tree.select('pagination').set(data.pagination)
    })
  }

  if (!pagination) return <Fragment />

  return (
    <div styleName="wrapper">
      <a href="#" onClick={loadMore}>
        Load more
      </a>
    </div>
  )
}
