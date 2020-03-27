class Editable extends HTMLElement {
  connectedCallback() {
    this.setAttribute('contenteditable', true)
    this.addEventListener('click', () => this.focus())
  }

  __cursorPos = 0
  __cursorPosListeners = []
  get cursorPos() {
    return this.__cursorPos
  }
  set cursorPos(val) {
    this.__cursorPos = val
    this.__cursorPosListeners.forEach(cb => setTimeout(() => cb(val), 1))
  }

  addCursorPosListener(cb) {
    this.__cursorPosListeners.push(cb)
  }

  getContainerOffset(container) {
    let nodes = Array.from(this.childNodes)
    while (nodes.filter(node => node.childNodes.length).length) {
      nodes = nodes
        .map(el =>
          el.nodeName === '#text' || el.nodeName === 'BR'
            ? [el]
            : Array.from(el.childNodes)
        )
        .flat(Infinity)
    }

    let offset = 0
    for (let node of nodes) {
      if (node === container) break
      offset += node.length || 1
    }

    return offset
  }

  getContainerAtOffset(offset) {
    let nodes = Array.from(this.childNodes)
    while (nodes.filter(node => node.childNodes.length).length) {
      nodes = nodes
        .map(el =>
          el.nodeName === '#text' || el.nodeName === 'BR'
            ? [el]
            : Array.from(el.childNodes)
        )
        .flat(Infinity)
    }

    let lastNode
    let x = 0
    for (let node of nodes) {
      if (node.nodeName == 'BR') {
        x += 1
        continue
      }
      if (node.nodeName !== '#text') {
        if (!node.firstChild) continue
        node = node.firstChild
      }
      lastNode = node
      if (x + (node.length || 1) >= offset) break
      x += node.length || 1
    }
    return { line: lastNode || nodes[0], n: x }
  }

  setCursorPos(offset) {
    let containerData = this.getContainerAtOffset(offset)
    let node = containerData.line
    let n = containerData.n

    if (!node) return

    if (node.firstChild) node = node.firstChild

    var range = window.getSelection().getRangeAt(0)
    range.setEnd(node, offset - n)
    range.setStart(node, offset - n)
    this.cursorPos = offset
  }

  getCursorPos() {
    var caretOffset = 0
    var range = window.getSelection().getRangeAt(0)
    var selected = range.toString().length
    var preCaretRange = range.cloneRange()

    preCaretRange.selectNodeContents(this)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    caretOffset = preCaretRange.toString().length - selected

    const brCount = Array.from(preCaretRange.cloneContents().childNodes)
      .map(el =>
        el.nodeName === '#text' ? [] : Array.from(el.querySelectorAll('*'))
      )
      .flat(Infinity)
      .filter(el => el.nodeName === 'BR').length
    caretOffset += brCount

    return caretOffset
  }

  getSelection() {
    if (window.getSelection().type === 'None') return {}
    let range = window.getSelection().getRangeAt(0)
    let result = {}
    let firstOffset = this.getContainerOffset(range.startContainer)
    let secondOffset = this.getContainerOffset(range.endContainer)

    result.toString = () => range.toString()

    result.collapsed = range.collapsed

    result.startContainer = range.startContainer
    result.startOffset = range.startOffset + firstOffset

    result.endContainer = range.endContainer
    result.endOffset = range.endOffset + secondOffset

    return result
  }
}

customElements.define('baka-editable', Editable)
