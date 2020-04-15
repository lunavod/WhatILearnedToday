// @flow

import React from 'react'

import PostContent from '../PostContent'

import styles from './styles.css'

type PropTypes = {
  title: string,
  text: string,
}

export default function PostPreview({ title, text }: PropTypes) {
  return (
    <div styleName="preview">
      <div styleName="previewTitle">{title}</div>
      <div styleName="previewText">
        <PostContent content={text} />
      </div>
    </div>
  )
}
