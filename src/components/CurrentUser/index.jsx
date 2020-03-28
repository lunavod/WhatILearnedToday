import React, { useState } from 'react'
import { useBranch } from 'baobab-react/hooks'

import classNames from 'classnames'
import styles from './styles.css'

export default function CurrentUser() {
  const { logInData, user, dispatch } = useBranch({
    logInData: 'logInData',
    user: 'currentUser'
  })

  const [isActive, setIsActive] = useState(false)

  const logOut = () => {
    dispatch(tree => {
      tree.select('logInData').set({ id: 0, loggedIn: false, apiKey: '' })
    })
  }

  const onClick = () => {
    setIsActive(!isActive)
  }

  return (
    <div styleName="wrapper">
      <div
        className={classNames({
          [styles.menu]: true,
          [styles.active]: isActive
        })}
      >
        <div>Настройки</div>
        <div onClick={logOut}>Выйти</div>
      </div>
      <img
        onClick={onClick}
        styleName="avatar"
        src={
          user.avatar ||
          'https://skynetgaming.net/uploads/monthly_2020_03/Capture.thumb.PNG.7162eef397706a6f76dc1faf18b414c8.PNG'
        }
      />
    </div>
  )
}
