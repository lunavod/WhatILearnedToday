// @flow

import React from 'react'
import { useRoot } from 'baobab-react/hooks'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import NotificationsList from '../NotificationsList'

import getRouteForUrl from '../../routing'

import styles from './styles.css'

export default function App({
  store,
  pathname,
}: {
  store: {},
  pathname: string,
}) {
  if (!pathname) pathname = location.pathname
  const Root = useRoot(store)
  const route = getRouteForUrl(pathname)
  const Page = route.Controller

  return (
    <Root>
      <div styleName="wrapper">
        <NotificationsList />
        <Navbar />
        <div styleName="left">
          <Sidebar />
        </div>
        <div styleName="middle">
          <Page routeData={route.data} />
        </div>
        <div styleName="right">
          <div styleName="nekoPlaceholder">
            Тут будет неко с ноутбуком, но пока тут только я, Дио!
          </div>
        </div>
      </div>
    </Root>
  )
}
