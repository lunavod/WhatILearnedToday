import React, { Fragment, useState } from 'react'

import syles from './styles.css'

export default function AddPost({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const publish = () => {
    onSubmit(title, text)
    setTitle('')
    setText('')
  }

  return (
    <Fragment>
      <div styleName="wrapper">
        <input
          type="text"
          styleName="title"
          placeholder="Дорогая принцесса Селестия..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          styleName="text"
          placeholder="Сегодня я точно напишу что-нибудь интересное!"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div styleName="actions">
        <button styleName="secondary">Сохранить</button>
        <button styleName="primary" onClick={publish}>
          Опубликовать
        </button>
      </div>
    </Fragment>
  )
}
