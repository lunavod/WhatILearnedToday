// @flow

import React from 'react'

import styles from './styles.css'

type PropTypes = {
  title: string,
  text: string,
}

export default function PostPreview({ title, text }: PropTypes) {
  return (
    <div styleName="preview">
      <div styleName="previewTitle">{title}</div>
      <div styleName="previewText" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  )
}
