// @flow

import React, { Fragment } from 'react'

import { useBranch } from 'baobab-react/hooks'

import styles from './styles.css'
import Modal from '../Modal'
import Post from '../../Post'

export default function ShowPostModal() {
  const { post, dispatch } = useBranch({
    post: ['modals', 'ShowPostModal', 'post'],
  })

  if (!post) return <Fragment />

  const goBack = () => {
    window.Router.goTo('/')
    dispatch((tree) => {
      tree.select('modals', 'ShowPostModal', 'isOpen').set(false)
    })
  }

  return (
    <Modal
      close={goBack}
      isOpen={true}
      style={{ maxWidth: '900px', width: '100%' }}
      wrapperStyle={{ alignItems: 'flex-start', paddingTop: '80px' }}
    >
      <Post post={post} full />
    </Modal>
  )
}
