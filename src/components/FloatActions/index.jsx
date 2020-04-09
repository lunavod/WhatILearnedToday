// @flow

import React, { Fragment, useState } from 'react'
import AddPostModal from '../../components/AddPostModal'

import styles from './styles.css'

export default function FloatActions() {
  const [showModal, setShowModal] = useState(false)

  const closeModal = () => setShowModal(false)

  return (
    <Fragment>
      <div styleName="wrapper">
        <div styleName="button" onClick={() => setShowModal(true)}>
          <i className="far fa-pencil" />
        </div>
      </div>
      {showModal && <AddPostModal close={closeModal} />}
    </Fragment>
  )
}
