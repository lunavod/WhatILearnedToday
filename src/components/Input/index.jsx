// @flow

import React, { useState, useRef } from 'react'

import classNames from 'classnames'

import styles from './styles.css'

type PropTypes = {
  initialValue?: string,
  placeholder?: string,
  type?: string,
  onChange?: () => {},
  accent?: boolean,
  style?: {
    [string]: any,
  },
}

export default function Input({
  initialValue,
  placeholder,
  type,
  onChange,
  accent,
  style,
}: PropTypes) {
  const [focused, setFocused] = useState(false)

  const [value, setValue] = useState(initialValue || '')

  const inputRef = useRef()

  return (
    <div
      styleName={classNames({
        wrapper: true,
        active: focused,
        not_empty: value,
        accent: accent,
      })}
    >
      <div styleName="placeholder" onClick={() => inputRef.current.focus()}>
        {placeholder}
      </div>
      <input
        ref={inputRef}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e)
        }}
        styleName="input"
        type={type}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={style}
      />
    </div>
  )
}
