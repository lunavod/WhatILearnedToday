import React, { Fagment } from 'react'
import { useRoot } from 'baobab-react/hooks'
import AddPost from '../AddPost'
import Sidebar from '../Sidebar'
import Posts from '../Posts'

import routing from '../../routing'

import syles from './styles.css'

export default function App({ store, pathname }) {
  if (!pathname) pathname = location.pathname
  const Root = useRoot(store)
  const controller = routing[pathname] || routing[404]
  const Page = controller.Controller
  return (
    <Root>
      <div styleName="wrapper">
        <div styleName="left">
          <Sidebar />
        </div>
        <div styleName="right">
          <Page />
        </div>
      </div>
    </Root>
  )
}
