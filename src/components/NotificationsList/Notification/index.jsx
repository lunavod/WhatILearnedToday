import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useBranch } from 'baobab-react/hooks'

import classNames from 'classnames'

import styles from './styles.css'

export default function Notification({ data, tickTimer, close }) {
  useEffect(() => {
    let timerId = 0
    const interval = () => {
      if (data.timer > 0) tickTimer()
      else close()
    }
    timerId = setInterval(interval, 1000)
    return () => {
      clearInterval(timerId)
    }
  })
  return (
    <div
      className={classNames({
        [styles.wrapper]: true,
        [styles.info]: data.type === 'info',
        [styles.error]: data.type === 'error',
      })}
    >
      <span styleName="title">{data.title}</span>
      <div styleName="close" onClick={close}>
        <i className="fal fa-times"></i>
      </div>
    </div>
  )
}

Notification.propTypes = {}
