// @flow

import React from 'react'
import { useRoot } from 'baobab-react/hooks'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import NotificationsList from '../NotificationsList'
import LoginActionsModal from '../modals/LoginActionsModal'

import styles from './styles.css'
import InvitesModal from '../modals/InvitesModal'
import FloatActions from '../FloatActions'
import AddPostModal from '../modals/AddPostModal'
import EditPostModal from '../modals/EditPostModal'
import RouteRenderer from '../RouteRenderer'

export default function App({
  store,
  pathname,
}: {
  store: {},
  pathname: string,
}) {
  const Root = useRoot(store)

  return (
    <Root>
      <div styleName="wrapper">
        <NotificationsList />
        <Navbar />
        <div styleName="sidebar_left">
          <Sidebar />
        </div>
        <div styleName="content">
          <RouteRenderer pathname={pathname} />
        </div>
        <div styleName="sidebar_right">
          <div styleName="neko_placeholder">
            Тут будет неко с ноутбуком, но пока тут только я, Дио!
          </div>
        </div>
      </div>
      <LoginActionsModal />
      <InvitesModal />
      <AddPostModal />
      <EditPostModal />
      <FloatActions />
    </Root>
  )
}
