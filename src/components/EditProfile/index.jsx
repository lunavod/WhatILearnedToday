// @flow

import React, { Fragment, useRef, useState, useEffect } from 'react'

import { useBranch } from 'baobab-react/hooks'

import styles from './styles.css'
import dateFormat from 'dateformat'
import Button from '../Button'
import Confirm from '../Confirm'
import { editUser } from '../../api'
import { addNotification } from '../../actions/notifications'
import FileDnD from '../FileDnD'

export default function EditProfile() {
  const { profile, dispatch } = useBranch({
    profile: 'profile',
  })

  if (!profile) return <Fragment />

  const editorRef = useRef()
  const [description, setDescription] = useState(profile.description || '')
  const [originalDescription, setOriginalDescription] = useState(
    profile.original_description || ''
  )
  const [isResetConfirmShown, setIsResetConfirmShown] = useState(false)

  const [avatarFile, setAvatarFile] = useState()
  const [avatarURL, setAvatarURL] = useState()

  useEffect(() => {
    const editor = editorRef.current
    editor.setText(originalDescription || '')
    editor.addEventListener('change', (e) => {
      const html = e.detail.html
      const original = e.detail.original
      setDescription(html)
      setOriginalDescription(original)
    })
  }, [profile])

  const onResetClick = (e) => {
    if (description === profile.description) return
    setIsResetConfirmShown(true)
  }

  const onResetAccept = () => {
    const editor = editorRef.current

    setDescription(profile.description || '')
    editor.setText(profile.description || '')
    setIsResetConfirmShown(false)
  }

  const onResetDeny = () => {
    setIsResetConfirmShown(false)
  }

  const onSubmitClick = async () => {
    await editUser(profile.id, description, originalDescription, avatarFile)
    dispatch((tree) => {
      tree.select('profile').set({
        ...profile,
        description,
        original_description: originalDescription,
      })
    })
    dispatch(addNotification('Пользователь обновлен успешно!'))
  }

  return (
    <Fragment>
      {isResetConfirmShown && (
        <Confirm
          text="Вы уверены, что хотите отменить изменения?"
          onAccept={onResetAccept}
          onDeny={onResetDeny}
        />
      )}
      <div styleName="wrapper">
        <div styleName="avatar_wrapper">
          <img
            src={
              profile.avatar_url
                ? globalThis.ENV.API + profile.avatar_url
                : '/public/images/default_avatar.png'
            }
            styleName="avatar"
          />

          {avatarURL && (
            <div
              style={{
                background: `url(${avatarURL}) center center`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
              styleName="avatar_preview"
            />
          )}

          <div styleName="dnd_wrapper">
            <FileDnD
              style={{ borderRadius: '50%' }}
              onDrop={(files) => {
                setAvatarFile(files.dataTransfer.files[0])
                const reader = new FileReader()
                reader.readAsDataURL(files.dataTransfer.files[0])
                reader.onload = function (e) {
                  setAvatarURL(e.target.result)
                }
              }}
            >
              Загрузить аватар
            </FileDnD>
          </div>
        </div>
        <div styleName="data_wrapper">
          <div styleName="top">
            <div>
              <div styleName="username">{profile.username}</div>
              <div styleName="info">
                Дата регистрации:{' '}
                {dateFormat(new Date(profile.created_at), 'dd.mm.yyyy')}
              </div>
            </div>
            <div styleName="buttonsWrapper">
              <Button
                circle
                shadow
                accent
                style={{ marginRight: '16px' }}
                onClick={onResetClick}
              >
                <i className="far fa-undo" />
              </Button>
              <Button circle shadow onClick={onSubmitClick}>
                <i className="far fa-check" />
              </Button>
            </div>
          </div>
          <div styleName="bottom">
            <baka-editor ref={editorRef} placeholder="О себе" />
          </div>
        </div>
      </div>
    </Fragment>
  )
}
