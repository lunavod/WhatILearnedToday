import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import Notification from './Notification'

import styles from './styles.css'

export default function NotificationsList() {
  const { notifications, dispatch } = useBranch({
    notifications: 'notifications',
  })

  return (
    <div styleName="wrapper">
      {notifications.map((notification) => {
        return (
          <Notification
            key={`notification_${notification.id}`}
            data={notification}
          />
        )
      })}
    </div>
  )
}
