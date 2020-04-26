// @flow

import React, { Fragment } from 'react'

import { useBranch } from 'baobab-react/hooks'
import getRouteForUrl from '../../routing'
import { useRouter } from '../../utils/hooks'

import styles from './styles.css'

type PropTypes = {
  pathname?: string,
}

export default function RouteRenderer({ pathname }: PropTypes) {
  const { dispatch } = useBranch({})

  if (!pathname) {
    pathname = useRouter()

    window.Router.addEventListener('reload', () => {
      dispatch((tree) => {
        route.loadData(tree, route.data)
      })
    })
  }
  const route = getRouteForUrl(pathname)
  const Page = route.Controller
  dispatch((tree) => {
    route.loadData(tree, route.data)
  })

  return <Page routeData={route.data} />
}
