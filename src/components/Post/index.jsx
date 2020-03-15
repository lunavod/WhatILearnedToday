import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import syles from './styles.css'

export default function Post({ post }) {
  return <Fragment>Hello, Post!</Fragment>
}

Post.propTypes = {
  post: PropTypes.object.isRequired
}
