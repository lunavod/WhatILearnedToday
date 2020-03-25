import Document from './document'
import Editable from './editable'

class BakaEditor extends HTMLElement {
  template = `<div id="wrapper">
        <div id="buttons">
            <a href="#" id="bold" class="">B</a>
            <a href="#" id="italic" class="">I</a>
            <a href="#" id="strike" class="">S</a>
        </div>
        <div id="placeholder">Type: Echo!</div>
        <baka-editable id="editor" />
    </div>`

  elms = {}
  stylesOverride = {}

  static get observedAttributes() {
    return ['placeholder']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'placeholder':
        if (this.elms.placeholder) this.elms.placeholder.innerHTML = newValue
        break
      case 'output':
        this.outputContainer = document.querySelector(
          this.getAttribute('output')
        )
        break
    }
  }

  connectedCallback() {
    this.innerHTML = this.template

    this.outputContainer = document.querySelector(this.getAttribute('output'))

    this.elms.wrapper = this.querySelector('#wrapper')
    this.elms.editor = this.querySelector('#editor')

    this.elms.placeholder = this.querySelector('#placeholder')
    if (this.getAttribute('placeholder') && this.elms.placeholder)
      this.elms.placeholder.innerHTML = this.getAttribute('placeholder')

    this.document = new Document()
    this.document.addEventListener('update', this.onTextUpdate.bind(this))
    this.document.addEventListener('update', this.logger.bind(this))

    this.initEditor()
    this.initButtons()

    this.logger({ type: 'INIT' })
  }

  updateButtons() {
    let range = this.elms.editor.getSelection()
    let offset = range.startOffset
    const styles = range.collapsed
      ? Object.keys(this.document.getStylesAtOffset(offset))
      : this.document.getStylesAtRange(range.startOffset, range.endOffset)

    for (let styleName in this.stylesOverride) {
      if (styles.indexOf(styleName) >= 0 && !this.stylesOverride[styleName]) {
        styles.splice(styles.indexOf(styleName), 1)
      }
      if (styles.indexOf(styleName) < 0 && this.stylesOverride[styleName]) {
        styles.push(styleName)
      }
    }

    this.elms.wrapper
      .querySelectorAll('#buttons > a')
      .forEach(el => el.classList.remove('active'))
    styles.forEach(style => {
      this.elms.buttons[style].classList.add('active')
    })
  }

  initButtons() {
    this.elms.editor.addCursorPosListener(() => {
      this.stylesOverride = {}
      this.updateButtons()
    })
    this.elms.buttons = {
      wrapper: this.elms.wrapper.querySelector('#buttons'),
      bold: this.elms.wrapper.querySelector('#buttons #bold'),
      italic: this.elms.wrapper.querySelector('#buttons #italic'),
      strike: this.elms.wrapper.querySelector('#buttons #strike')
    }

    const onButtonClick = (buttonName, e) => {
      e.preventDefault()
      this.elms.editor.focus()

      const range = this.elms.editor.getSelection()
      if (!range.collapsed) {
        const styles = this.document.getStylesAtRange(
          range.startOffset,
          range.endOffset
        )
        if (styles.indexOf(buttonName) >= 0) {
          this.document.unmark(buttonName, range.startOffset, range.endOffset)
        } else {
          this.document.mark(buttonName, range.startOffset, range.endOffset)
        }
        this.elms.editor.cursorPos = range.endOffset
        this.elms.editor.setCursorPos(range.endOffset)
        return
      }

      const button = this.elms.buttons[buttonName]
      const isActive = button.classList.contains('active')

      this.stylesOverride[buttonName] = !isActive

      // this.elms.buttons[buttonName].classList.toggle('active')
    }

    for (let styleName in this.document.styles) {
      this.elms.buttons[styleName].addEventListener('click', e =>
        onButtonClick(styleName, e)
      )
    }
    window.document.addEventListener('click', e => {
      this.updateButtons()
    })
  }

  logger(historyEvent) {
    console.log(
      '\n%cFired event %s\n%c%s\n%s\n%c%s\n%s%o\n%s%o\n',
      ['font-weight: bold', 'margin-bottom: 6px'].join(';'),
      historyEvent.type.toUpperCase(),
      ['color: rgba(0,0,0,1)', 'padding-bottom: 6px'].join(';'),
      this.document.text.slice(0, this.elms.editor.cursorPos) +
        '][' +
        this.document.text.slice(
          this.elms.editor.cursorPos,
          this.document.text.length
        ),
      this.document.toHtml(),
      ['color: rgba(0,0,0,.9)', 'line-height: 1.4em'].join(';'),
      `Document length: ${this.document.text.length}; Cursor position: ${this.elms.editor.cursorPos}`,
      'Event details:',
      historyEvent,
      'Styles:',
      this.document.styles
    )
  }

  onTextUpdate(event) {
    if (this.document.text.length) {
      this.elms.placeholder.classList.add('invisible')
    } else {
      this.elms.placeholder.classList.remove('invisible')
    }

    const html = this.document.toHtml()
    this.elms.editor.innerHTML = html
    if (this.outputContainer) this.outputContainer.value = html

    this.elms.editor.setCursorPos(this.elms.editor.cursorPos)
  }

  initEditor() {
    if (this.document.text.length) {
      this.elms.placeholder.classList.add('invisible')
    } else {
      this.elms.placeholder.classList.remove('invisible')
    }

    let lastSelection

    this.elms.editor.innerHTML = this.document.toHtml()

    this.elms.editor.addEventListener('beforeinput', e => {
      lastSelection = this.elms.editor.getSelection()
    })

    this.elms.editor.addEventListener('input', e => {
      if (e.inputType !== 'insertText') return

      e.preventDefault()

      // let range = this.elms.editor.getSelection()
      let range =
        lastSelection && !lastSelection.collapsed
          ? lastSelection
          : this.elms.editor.getSelection()
      range.startOffset -= e.data.length
      if (range.collapsed) {
        this.elms.editor.cursorPos = range.startOffset + 1
        this.document.insert(range.startOffset, e.data)
      } else {
        this.elms.editor.setCursorPos(range.startOffset + 1 + e.data.length)
        this.document.replace(range.startOffset + 1, range.endOffset, e.data)
      }

      let styles = this.document.getStylesAtOffset(range.startOffset)
      for (let styleName in this.stylesOverride) {
        if (this.stylesOverride[styleName] && !(styleName in styles))
          this.document.mark(
            styleName,
            range.startOffset,
            range.startOffset + e.data.length
          )
        if (!this.stylesOverride[styleName] && styleName in styles)
          this.document.unmark(
            styleName,
            range.startOffset,
            range.startOffset + e.data.length
          )
      }
      this.stylesOverride = {}
    })

    this.elms.editor.addEventListener('input', e => {
      if (e.inputType !== 'insertParagraph') return

      let range = this.elms.editor.getSelection()

      if (range.collapsed) {
        this.elms.editor.cursorPos = range.startOffset + 1
        this.document.insert(range.startOffset, '\n')
        return
      }

      this.elms.editor.cursorPos += 1
      this.document.replace(range.startOffset, range.endOffset, '\n')
    })

    this.elms.editor.addEventListener('beforeinput', e => {
      if (e.inputType !== 'deleteContentBackward') return

      e.preventDefault()

      let range = this.elms.editor.getSelection()
      if (range.startOffset < 1 && range.collapsed) return

      if (range.collapsed) {
        this.elms.editor.cursorPos = range.startOffset - 1
        this.document.delete(range.startOffset - 1, 1)
        return
      }
      this.elms.editor.cursorPos = range.startOffset

      this.document.delete(
        range.startOffset,
        range.endOffset - range.startOffset
      )
    })

    this.elms.editor.addEventListener('beforeinput', e => {
      if (e.inputType !== 'deleteContentForward') return

      e.preventDefault()

      let range = this.elms.editor.getSelection()
      this.elms.editor.cursorPos = range.startOffset

      if (range.collapsed) {
        this.document.delete(range.startOffset, 1, 'forward')
        return
      }
      this.document.replace(range.startOffset, range.endOffset, '')
    })

    this.elms.editor.addEventListener('keydown', e => {
      if (!e.ctrlKey || e.key !== 'Delete') return

      e.preventDefault()

      let text = this.document.text
      let range = this.elms.editor.getSelection()

      text = text.slice(range.startOffset, text.length)
      let ch = this.document.text[range.startOffset]

      let firstIndex
      let regexp = ch.match(/\s/) !== null ? /\S/gm : /\s/gm

      let matches = Array.from(text.matchAll(regexp))

      if (matches.length) firstIndex = matches[0].index
      else firstIndex = text.length

      this.document.delete(range.startOffset, firstIndex)
      this.elms.editor.setCursorPos(range.startOffset)
    })

    this.elms.editor.addEventListener('keydown', e => {
      if (!e.ctrlKey || e.key !== 'Backspace') return

      e.preventDefault()

      let text = this.document.text
      let range = this.elms.editor.getSelection()

      text = text.slice(0, range.startOffset)
      let ch = this.document.text[range.startOffset - 1]

      let firstIndex
      let regexp = ch.match(/\s/) !== null ? /\S/gm : /\s/gm

      let matches = Array.from(text.matchAll(regexp))

      if (matches.length) firstIndex = matches[matches.length - 1].index + 1
      else firstIndex = 0

      this.elms.editor.setCursorPos(
        range.startOffset - text.length + firstIndex
      )
      this.document.delete(
        range.startOffset - text.length + firstIndex,
        text.length - firstIndex
      )
    })

    this.elms.editor.addEventListener('keyup', e => {
      let navigationKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'PageUp',
        'PageDown'
      ]
      if (navigationKeys.indexOf(e.key) < 0) return

      this.elms.editor.__cursorPos = this.elms.editor.getCursorPos()
    })

    this.elms.editor.addEventListener('mouseup', e => {
      var range = window.getSelection().getRangeAt(0)
      if (range.startContainer.parentElement.classList.contains('empty')) {
        this.elms.editor.setCursorPos(0, range.startContainer)
      }
      this.elms.editor.cursorPos = this.elms.editor.getCursorPos()
    })
  }
}

customElements.define('baka-editor', BakaEditor)
