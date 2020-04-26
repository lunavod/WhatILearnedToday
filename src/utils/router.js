// @flow

type EventName = 'change' | 'reload'

export default class Router {
  url = location.pathname

  constructor() {
    window.addEventListener('popstate', () => {
      if (location.pathname === this.url) return
      this.url = location.pathname
      this.fireEvent('change', this.url)
    })
  }

  goTo(url: string) {
    window.history.pushState({}, '', url)
    this.url = url
    this.fireEvent('change', url)
  }

  reload() {
    this.fireEvent('reload', this.url)
  }

  _listeners: { [string]: () => {} } = {}
  addEventListener(event: EventName, callback: (newURL: string) => {}) {
    if (event in this._listeners) {
      if (this._listeners[event].indexOf(callback) >= 0) return
      this._listeners[event].push(callback)
    } else {
      this._listeners[event] = [callback]
    }
  }

  removeEventListener(event: EventName, callback: (newURL: string) => {}) {
    if (!(event in this._listeners)) return
    this._listeners[event].splice(this._listeners[event].indexOf(callback), 1)
  }

  fireEvent(event: EventName, data) {
    if (!(event in this._listeners)) return
    console.log('THERE ARE EVENTS')
    this._listeners[event].forEach((cb) => cb(data))
  }
}
