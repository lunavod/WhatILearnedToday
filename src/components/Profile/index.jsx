// @flow

import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import dateFormat from 'dateformat'

import syles from './styles.css'

type Branch = {
  profile: {
    id: number,
    username: string,
    email: string,
    avatar?: string,
    created_at: string
  }
}

export default function Profile() {
  const { profile }: Branch = useBranch({
    profile: ['profile']
  })

  return (
    <div styleName="wrapper">
      <img
        src={
          profile.avatar ||
          'https://skynetgaming.net/uploads/monthly_2020_03/Capture.thumb.PNG.7162eef397706a6f76dc1faf18b414c8.PNG'
        }
        styleName="avatar"
      />
      <div styleName="data_wrapper">
        <div styleName="top">
          <div>
            <div styleName="username">{profile.username}</div>
            <div styleName="info">
              Дата регистрации:{' '}
              {dateFormat(new Date(profile.created_at), 'dd.mm.yyyy')}
            </div>
          </div>
          <div>
            <span styleName="thumbsup">{'👍'}</span>
          </div>
        </div>
        <div styleName="bottom">
          Nullam efficitur lacus sit amet nisl ultricies vestibulum. Integer
          varius massa sed est aliquam, vel hendrerit sapien sodales. Nunc
          libero erat, eleifend at odio eu, tempus egestas nibh. Integer sed
          hendrerit nisl, in vestibulum felis. Ut egestas ut leo vel vehicula.
          Nunc ac velit vel nulla tincidunt tristique.
        </div>
      </div>
    </div>
  )
}
