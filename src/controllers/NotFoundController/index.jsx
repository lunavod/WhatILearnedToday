// @flow

import React, { Fragment } from 'react'

import styles from './styles.css'

export function Controller() {
  return (
    <div styleName={'wrapper'}>
      <h1>Ошибка 404</h1>
      Страница не найдена
    </div>
  )
}

export async function loadData() {}

export const ControllerName = 'NotFoundController'
