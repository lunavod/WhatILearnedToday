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
    created_at: string,
  },
}

export default function Profile() {
  const { profile }: Branch = useBranch({
    profile: ['profile'],
  })

  return (
    <div styleName="wrapper">
      <img
        src={
          profile.avatar_url
            ? globalThis.ENV.API + profile.avatar_url
            : '/public/images/default_avatar.png'
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
          {/*<div>*/}
          {/*  <span styleName="thumbsup">{'👍'}</span>*/}
          {/*</div>*/}
        </div>
        <div
          styleName="bottom"
          dangerouslySetInnerHTML={{ __html: profile.description }}
        ></div>
      </div>
    </div>
  )
}
