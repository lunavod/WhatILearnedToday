import React, { useState } from 'react'
import { useBranch } from 'baobab-react/hooks'
import Modal from '../Modal'
import Input from '../Input'
import Button from '../Button'
import { login, register } from '../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import PropTypes from 'prop-types'

import syles from './styles.css'

export default function LoginActionsModal() {
  const { isOpen, dispatch, logInTexts, registerTexts } = useBranch({
    isOpen: ['modals', 'LoginActions', 'isOpen'],
    logInTexts: ['modals', 'LoginActions', 'logIn'],
    registerTexts: ['modals', 'LoginActions', 'register']
  })

  const [logInUsernameErrors, setLogInUsernameErrors] = useState('')
  const [logInPasswordErrors, setLogInPasswordErrors] = useState('')

  const [registerUsernameErrors, setRegisterUsernameErrors] = useState('')
  const [registerEmailErrors, setRegisterEmailErrors] = useState('')
  const [registerPasswordErrors, setRegisterPasswordErrors] = useState('')

  const updateText = (type, name, value) => {
    dispatch(tree => {
      tree.select(['modals', 'LoginActions', type, name]).set(value)
    })
  }

  const onCloseClick = () => {
    dispatch(tree => {
      tree.select(['modals', 'LoginActions', 'isOpen']).set(false)
    })
  }

  const onLoginClick = async () => {
    const resp = await login(logInTexts.username, logInTexts.password)
    const logInErrors = resp.errors
    console.log(resp)

    setLogInUsernameErrors([])
    setLogInPasswordErrors([])

    console.log('LogInerrors', logInErrors)
    if (resp.code === 200) {
      dispatch(tree => {
        tree
          .select(['modals', 'LoginActions', 'logIn'])
          .set({ username: '', password: '' })
        tree.select(['modals', 'LoginActions', 'isOpen']).set(false)
        tree
          .select(['currentUser'])
          .set({ id: resp.result.session.user_id, loggedIn: true })
      })
      return
    }

    for (let fieldName in logInErrors) {
      let errors = logInErrors[fieldName].map(error => (
        <div key={error}>
          {fieldName} {error}
        </div>
      ))
      switch (fieldName) {
        case 'user':
          setLogInUsernameErrors(errors)
          break
        case 'password':
          setLogInPasswordErrors(errors)
          break
      }
    }
  }

  const onRegisterClick = async () => {
    const resp = await register(
      registerTexts.username,
      registerTexts.email,
      registerTexts.password
    )
    const registerErrors = resp.errors

    setRegisterUsernameErrors([])
    setRegisterEmailErrors([])
    setRegisterPasswordErrors([])

    if (resp.code === 200) {
      dispatch(tree => {
        tree
          .select(['modals', 'LoginActions', 'register'])
          .set({ username: '', email: '', password: '' })
        tree.select(['modals', 'LoginActions', 'isOpen']).set(false)
        tree
          .select(['currentUser'])
          .set({ id: resp.result.session.user_id, loggedIn: true })
      })
    }

    for (let fieldName in registerErrors) {
      let errors = registerErrors[fieldName].map(error => (
        <div key={error}>
          {fieldName} {error}
        </div>
      ))
      switch (fieldName) {
        case 'username':
          setRegisterUsernameErrors(errors)
          break
        case 'email':
          setRegisterEmailErrors(errors)
          break
        case 'password':
          setRegisterPasswordErrors(errors)
          break
      }
    }
  }

  return (
    <Modal isOpen={isOpen}>
      <div styleName="wrapper">
        <div styleName="left">
          <h2>Вход</h2>
          <Input
            type="text"
            placeholder="Имя пользователя"
            value={logInTexts.username}
            onChange={e => updateText('logIn', 'username', e.target.value)}
          />
          <div styleName="fieldErrors">{logInUsernameErrors}</div>
          <Input
            type="password"
            placeholder="Пароль"
            value={logInTexts.password}
            onChange={e => updateText('logIn', 'password', e.target.value)}
          />
          <div styleName="fieldErrors">{logInPasswordErrors}</div>
          <Button style={{ marginTop: 'auto' }} round onClick={onLoginClick}>
            Войти
          </Button>
        </div>
        <div styleName="right">
          <div styleName="close" onClick={onCloseClick}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <h2>Регистрация</h2>
          <Input
            type="text"
            placeholder="Имя пользователя"
            accent
            value={registerTexts.username}
            onChange={e => updateText('register', 'username', e.target.value)}
          />
          <div styleName="fieldErrors">{registerUsernameErrors}</div>
          <Input
            type="email"
            placeholder="Email"
            accent
            value={registerTexts.email}
            onChange={e => updateText('register', 'email', e.target.value)}
          />
          <div styleName="fieldErrors">{registerEmailErrors}</div>
          <Input
            type="password"
            placeholder="Пароль"
            accent
            value={registerTexts.password}
            onChange={e => updateText('register', 'password', e.target.value)}
          />
          <div styleName="fieldErrors">{registerPasswordErrors}</div>
          <Button
            style={{ marginTop: '16px' }}
            accent
            round
            onClick={onRegisterClick}
          >
            Зарегистрироваться
          </Button>
        </div>
      </div>
    </Modal>
  )
}

LoginActionsModal.propTypes = {}
