import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import syles from './styles.css'

export default function Input({ placeholder, type, onChange, accent }) {
  const [focused, setFocused] = useState(false)

  const [value, setValue] = useState('')

  const inputRef = useRef()

  return (
    <div
      styleName={classNames({
        wrapper: true,
        active: focused,
        not_empty: value,
        accent: accent
      })}
    >
      <div styleName="placeholder" onClick={() => inputRef.current.focus()}>
        {placeholder}
      </div>
      <input
        ref={inputRef}
        onChange={e => {
          setValue(e.target.value)
          onChange(e)
        }}
        styleName="input"
        type={type}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}

Input.propTypes = {}
