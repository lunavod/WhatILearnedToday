import React, { Fagment } from 'react'
import { useRoot } from 'baobab-react/hooks'
import AddPost from '../AddPost'
import Sidebar from '../Sidebar'
import Posts from '../Posts'

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
        <div styleName="left">
          <Sidebar />
        </div>
        <div styleName="right">
          <Page routeData={route.data} />
        </div>
      </div>
    </Root>
  )
}
