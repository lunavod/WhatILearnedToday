// @flow

import React, { useEffect, useState } from 'react'

import { useBranch } from 'baobab-react/hooks'

import styles from './styles.css'
import Modal from '../Modal'

import { User, Invite, getUserInvites, createInvite } from '../../../api'
import { copyToClipboard } from '../../../utils/clipboard'
import Button from '../../Button'
import { addNotification } from '../../../actions/notifications'

type BranchTypes = {
  isOpen: boolean,
  currentUser: User,
  invites: Invite[],
  dispatch: () => {},
}

export default function InvitesModal() {
  const { isOpen, currentUser, invites, dispatch }: BranchTypes = useBranch({
    isOpen: ['modals', 'InvitesModal', 'isOpen'],
    invites: ['modals', 'InvitesModal', 'invites'],
    currentUser: 'currentUser',
  })

  const [newInviteDescription, setNewInviteDescription] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const newInvites = await getUserInvites(currentUser.id)
      console.log(newInvites)
      dispatch((tree) => {
        tree.select(['modals', 'InvitesModal', 'invites']).set(newInvites || [])
      })
    }
    loadData()
  }, [currentUser.id])

  const close = () => {
    dispatch((tree) =>
      tree.select(['modals', 'InvitesModal', 'isOpen']).set(false)
    )
  }

  const generateInvite = async () => {
    const newInvite = await createInvite(newInviteDescription)
    dispatch((tree) => {
      tree.select(['modals', 'InvitesModal', 'invites']).push(newInvite)
    })
    setNewInviteDescription('')
    dispatch(addNotification('Инвайт сгенерирован успешно!'))
  }

  return (
    <Modal
      isOpen={isOpen}
      close={close}
      style={{ width: '100%', maxWidth: '500px' }}
    >
      <div styleName="wrapper">
        <h1>Список инвайтов:</h1>
        <div styleName="invites">
          {invites.map((invite) => (
            <UserInvite data={invite} key={`invite_${invite.id}`} />
          ))}
        </div>
        <h2>Сгенерировать инвайт:</h2>
        <div styleName="new_invite_wrapper">
          <textarea
            styleName="new_invite_description"
            placeholder="Описание нового инвайта"
            value={newInviteDescription}
            onChange={(e) => setNewInviteDescription(e.target.value)}
          />
          <Button circle shadow onClick={generateInvite}>
            <i className="far fa-check" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function UserInvite({ data }: { data: Invite }) {
  const [copyDone, setCopyDone] = useState(false)

  const onCopyClick = () => {
    copyToClipboard(data.code)
    setCopyDone(true)
    setTimeout(() => setCopyDone(false), 500)
  }

  return (
    <div styleName="invite">
      <div styleName="top">
        <div styleName="user">
          {data.user?.id ? (
            <a
              href={`/users/${data.user.id}`}
              target="_blank"
              title={data.user.username}
            >
              {data.user?.username || ''}
            </a>
          ) : (
            <span styleName="not_used">Еще не использован</span>
          )}
        </div>
        <div styleName="code" onClick={onCopyClick}>
          {data.code}
        </div>
        <div styleName="copy" onClick={onCopyClick}>
          {copyDone ? (
            <i className="far fa-check" />
          ) : (
            <i className="far fa-copy" />
          )}
        </div>
      </div>

      {data.description && <div styleName="bottom">{data.description}</div>}
    </div>
  )
}
