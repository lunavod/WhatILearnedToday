// @flow

import React, { useEffect, useRef, useState } from 'react'

import styles from './styles.css'
import classNames from 'classnames'

export default function FileDnD({ children, onDrop, style }) {
  const dropAreaRef = useRef(null)
  const inputRef = useRef(null)
  const [isActive, setIsActive] = useState(false)

  const handleDrop = (files) => {
    onDrop(files)
  }

  useEffect(() => {
    const dropArea = dropAreaRef.current

    const preventDefaults = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
    ;['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(eventName, () => setIsActive(true), false)
    })
    ;['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, () => setIsActive(false), false)
    })

    dropArea.addEventListener('drop', handleDrop, false)

    return () => {
      dropArea.removeEventListener('drop', handleDrop, false)
    }
  }, [dropAreaRef.current])

  const onClick = (e) => {
    inputRef.current.click()
  }
  return (
    <div
      style={style}
      className={classNames({
        [styles.drop_area]: true,
        [styles.active]: isActive,
      })}
      ref={dropAreaRef}
      onClick={onClick}
    >
      <form action="#">
        <input
          type="file"
          multiple
          onChange={handleDrop}
          hidden
          ref={inputRef}
        />
      </form>
      {children}
    </div>
  )
}
