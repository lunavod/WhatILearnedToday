// @flow

import React, { Fragment } from 'react'

import { useBranch } from 'baobab-react/hooks'
import getRouteForUrl from '../../routing'
import { useRouter } from '../../utils/hooks'

import styles from './styles.css'
import { parseParams } from '../../utils/query'

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
  console.log('PATHNAME', pathname)
  const route = getRouteForUrl(pathname)
  const Page = route.Controller
  route.params = parseParams(location.search)
  console.log(route.params)
  dispatch((tree) => {
    route.loadData(tree, route.data, route.params)
  })

  return <Page routeData={route.data} />
}
