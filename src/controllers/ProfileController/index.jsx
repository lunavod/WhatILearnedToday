import React, { Fragment } from 'react'
import { useBranch } from 'baobab-react/hooks'

import syles from './styles.css'

export function Controller() {
  const {} = useBranch({})

  return <Fragment>Hello, ProfileController!</Fragment>
}

export async function loadData(tree) {}

export const ControllerName = 'ProfileController'
