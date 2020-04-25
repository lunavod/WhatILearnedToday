// @flow

import React, { Fragment, useState } from 'react'
import AddPostModal from '../modals/AddPostModal'

import styles from './styles.css'
import { useBranch } from 'baobab-react/hooks'

export default function FloatActions() {
  const { loggedIn, modalIsOpen, dispatch } = useBranch({
    loggedIn: ['logInData', 'loggedIn'],
    modalIsOpen: ['modals', 'AddPostModal', 'isOpen'],
  })

  if (!loggedIn) return <Fragment />

  const openModal = () => {
    dispatch((tree) => {
      tree.select(['modals', 'AddPostModal', 'isOpen']).set(true)
    })
  }

  return (
    <Fragment>
      <div styleName="wrapper">
        <div styleName="button" onClick={openModal}>
          <i className="far fa-pencil" />
        </div>
      </div>
    </Fragment>
  )
}
