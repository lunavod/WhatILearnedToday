import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import Notification from './Notification'

import styles from './styles.css'

export default function NotificationsList() {
  const { notifications, dispatch } = useBranch({
    notifications: 'notifications',
  })

  const getCloseById = (id) => () => {
    const index = notifications.findIndex((n) => n.id === id)
    dispatch((tree) => tree.select('notifications').splice([index, 1]))
  }

  const getTickTimerById = (id) => () => {
    const index = notifications.findIndex((n) => n.id === id)
    dispatch((tree) => {
      tree
        .select('notifications', index, 'timer')
        .set(notifications[index].timer - 1)
    })
  }

  return (
    <div styleName="wrapper">
      {notifications.map((notification) => {
        return (
          <Notification
            key={`notification_${notification.id}`}
            data={notification}
            tickTimer={getTickTimerById(notification.id)}
            close={getCloseById(notification.id)}
          />
        )
      })}
    </div>
  )
}
