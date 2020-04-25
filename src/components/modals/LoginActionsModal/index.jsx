import React, { useState } from 'react'
import { useBranch } from 'baobab-react/hooks'
import Modal from '../Modal'
import Input from '../../Input'
import Button from '../../Button'
import { getUser, login, register } from '../../../api'

import { addNotification } from '../../../actions/notifications'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'

import PropTypes from 'prop-types'

import styles from './styles.css'

export default function LoginActionsModal() {
  const { isOpen, dispatch, logInTexts, registerTexts } = useBranch({
    isOpen: ['modals', 'LoginActions', 'isOpen'],
    logInTexts: ['modals', 'LoginActions', 'logIn'],
    registerTexts: ['modals', 'LoginActions', 'register'],
  })

  const [logInUsernameErrors, setLogInUsernameErrors] = useState('')
  const [logInPasswordErrors, setLogInPasswordErrors] = useState('')

  const [registerUsernameErrors, setRegisterUsernameErrors] = useState('')
  const [registerEmailErrors, setRegisterEmailErrors] = useState('')
  const [registerPasswordErrors, setRegisterPasswordErrors] = useState('')
  const [registerInviteErrors, setRegisterInviteErrors] = useState('')

  const updateText = (type, name, value) => {
    dispatch((tree) => {
      tree.select(['modals', 'LoginActions', type, name]).set(value)
    })
  }

  const onCloseClick = () => {
    dispatch((tree) => {
      tree.select(['modals', 'LoginActions', 'isOpen']).set(false)
    })
  }

  const onLoginClick = async () => {
    const resp = await login(logInTexts.username, logInTexts.password)
    const logInErrors = resp.errors
    console.log(resp)

    setLogInUsernameErrors([])
    setLogInPasswordErrors([])

    if (resp.code === 200) {
      dispatch((tree) => {
        tree
          .select(['modals', 'LoginActions', 'logIn'])
          .set({ username: '', password: '' })
        tree.select(['modals', 'LoginActions', 'isOpen']).set(false)
        tree.select(['logInData']).set({
          id: resp.result.session.user_id,
          loggedIn: true,
          api_key: resp.result.key,
        })
      })
      const setCurrentUser = async () => {
        const user = await getUser(resp.result.session.user_id)
        dispatch((tree) => {
          tree.select('currentUser').set(user)
        })
        dispatch(addNotification('Вход выполнен успешно!'))
      }
      setCurrentUser()
      return
    }

    for (let fieldName in logInErrors) {
      let errors = logInErrors[fieldName].map((error) => (
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
      registerTexts.password,
      registerTexts.invite
    )
    const registerErrors = resp.errors

    setRegisterUsernameErrors([])
    setRegisterEmailErrors([])
    setRegisterPasswordErrors([])

    if (resp.code === 200) {
      dispatch((tree) => {
        tree
          .select(['modals', 'LoginActions', 'register'])
          .set({ username: '', email: '', password: '' })
        tree.select(['modals', 'LoginActions', 'isOpen']).set(false)
        tree.select(['logInData']).set({
          id: resp.result.session.user_id,
          loggedIn: true,
          api_key: resp.result.key,
        })
      })
      const setCurrentUser = async () => {
        const user = await getUser(resp.result.session.user_id)
        dispatch((tree) => {
          tree.select('currentUser').set(user)
        })
        dispatch(addNotification('Вход выполнен успешно!'))
      }
      setCurrentUser()
    }

    for (let fieldName in registerErrors) {
      let errors = registerErrors[fieldName].map((error) => (
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
        case 'invite':
          setRegisterInviteErrors(errors)
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      close={onCloseClick}
      style={{ width: '100%', maxWidth: '700px', padding: 0 }}
    >
      <div styleName="wrapper">
        <div styleName="left">
          <h2>Вход</h2>
          <Input
            type="text"
            placeholder="Имя пользователя"
            value={logInTexts.username}
            onChange={(e) => updateText('logIn', 'username', e.target.value)}
          />
          <div styleName="fieldErrors">{logInUsernameErrors}</div>
          <Input
            type="password"
            placeholder="Пароль"
            value={logInTexts.password}
            onChange={(e) => updateText('logIn', 'password', e.target.value)}
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
            onChange={(e) => updateText('register', 'username', e.target.value)}
            style={{ color: 'white' }}
          />
          <div styleName="fieldErrors">{registerUsernameErrors}</div>
          <Input
            type="email"
            placeholder="Email"
            accent
            value={registerTexts.email}
            onChange={(e) => updateText('register', 'email', e.target.value)}
            style={{ color: 'white' }}
          />
          <div styleName="fieldErrors">{registerEmailErrors}</div>
          <Input
            type="password"
            placeholder="Пароль"
            accent
            value={registerTexts.password}
            onChange={(e) => updateText('register', 'password', e.target.value)}
            style={{ color: 'white' }}
          />
          <div styleName="fieldErrors">{registerPasswordErrors}</div>
          <Input
            type="text"
            placeholder="Код инвайта"
            accent
            value={registerTexts.invite}
            onChange={(e) => updateText('register', 'invite', e.target.value)}
            style={{ color: 'white' }}
          />
          <div styleName="fieldErrors">{registerInviteErrors}</div>
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
