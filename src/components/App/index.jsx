import React, { Fagment } from 'react'
import { useRoot } from 'baobab-react/hooks'
import AddPost from '../AddPost'
import Sidebar from '../Sidebar'
import Posts from '../Posts'
import Navbar from '../Navbar'
import NotificationsList from '../NotificationsList'

import { addNotification } from '../../actions/notifications'

import getRouteForUrl from '../../routing'

import syles from './styles.css'

export default function App({ store, pathname }) {
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
          <Page routeData={route.data} />
        </div>
        <div styleName="right">
          <Sidebar />
        </div>
      </div>
    </Root>
  )
}
