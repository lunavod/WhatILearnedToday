// @flow

import React, { Fragment } from 'react'

import { useBranch } from 'baobab-react/hooks'

import styles from './styles.css'
import Modal from '../Modal'
import Post from '../../Post'

export default function ShowPostModal() {
  const { post } = useBranch({
    post: ['modals', 'ShowPostModal', 'post'],
  })

  if (!post) return <Fragment />

  return (
    <Modal
      close={() => {
        location.pathname = '/'
      }}
      isOpen={true}
      style={{ maxWidth: '900px' }}
      wrapperStyle={{ alignItems: 'flex-start', paddingTop: '80px' }}
    >
      <Post post={post} full />
    </Modal>
  )
}
