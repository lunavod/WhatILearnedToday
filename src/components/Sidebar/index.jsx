import React, { useRef, useEffect } from 'react'

import syles from './styles.css'

import fitty from 'fitty'

export default function Sidebar() {
  const refs = [useRef(), useRef(), useRef()]

  useEffect(() => {
    fitty(refs[0].current)
    fitty(refs[1].current)
    fitty(refs[2].current)
  })

  return (
    <div styleName="wrapper">
      <div styleName="logo">
        <div ref={refs[0]}>WHAT I</div>
        <div ref={refs[1]}>LEARNED</div>
        <div ref={refs[2]}>TODAY</div>
      </div>
    </div>
  )
}
