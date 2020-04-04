// @flow

import Document from './markdown_document'
import Editable from './editable'

class BakaEditor extends HTMLElement {
    template = `<div id="wrapper">
        <div id="buttons">
            <a href="#" id="bold" tabindex="-1" class="">B</a>
            <a href="#" id="italic" tabindex="-1" class="">I</a>
            <a href="#" id="strike" tabindex="-1" class="">S</a>
            <a href="#" id="underline" tabindex="-1" class="">U</a>
            <a href="#" id="monospace" tabindex="-1" class="">M</a>
        </div>
        <div id="placeholder">Type: Echo!</div>
        <baka-editable id="editor" />
    </div>`

    elms: {
        placeholder: HTMLElement,
    } = {}
    stylesOverride = {}
    outputContainer: HTMLElement | void | null
    originalOutputContainer: HTMLElement | void | null

    static get observedAttributes() {
        return ['placeholder', 'output', 'originaloutput']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'placeholder':
                if (!this.elms.placeholder) break
                this.elms.placeholder.innerHTML = newValue
                break
            case 'output':
                this.outputContainer = document.querySelector(
                    this.getAttribute('output')
                )
                break
            case 'originaloutput':
                this.originalOutputContainer = document.querySelector(
                    this.getAttribute('originaloutput')
                )
                break
        }
    }

    connectedCallback() {
        this.innerHTML = this.template

        this.outputContainer = document.querySelector(
            this.getAttribute('output')
        )

        this.elms.wrapper = this.querySelector('#wrapper')
        this.elms.editor = this.querySelector('#editor')

        this.elms.placeholder = this.querySelector('#placeholder')
        if (this.getAttribute('placeholder'))
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
            if (
                styles.indexOf(styleName) >= 0 &&
                !this.stylesOverride[styleName]
            ) {
                styles.splice(styles.indexOf(styleName), 1)
            }
            if (
                styles.indexOf(styleName) < 0 &&
                this.stylesOverride[styleName]
            ) {
                styles.push(styleName)
            }
        }

        this.elms.wrapper
            .querySelectorAll('#buttons > a')
            .forEach((el) => el.classList.remove('active'))
        styles.forEach((style) => {
            if (!(style in this.elms.buttons)) return
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
            strike: this.elms.wrapper.querySelector('#buttons #strike'),
            underline: this.elms.wrapper.querySelector('#buttons #underline'),
            monospace: this.elms.wrapper.querySelector('#buttons #monospace'),
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
                    this.document.unmark(
                        buttonName,
                        range.startOffset,
                        range.endOffset
                    )
                } else {
                    this.document.mark(
                        buttonName,
                        range.startOffset,
                        range.endOffset
                    )
                }
                this.elms.editor.cursorPos = range.endOffset
                this.elms.editor.setCursorPos(range.endOffset)
                return
            }

            const button = this.elms.buttons[buttonName]
            const isActive = button.classList.contains('active')

            this.stylesOverride[buttonName] = !isActive
        }

        for (let styleName in this.document.styles) {
            if (!(styleName in this.elms.buttons)) continue
            this.elms.buttons[styleName].addEventListener('click', (e) =>
                onButtonClick(styleName, e)
            )
        }
        window.document.addEventListener('click', () => {
            this.updateButtons()
        })
    }

    logger(historyEvent) {
        if (!this.debug) return
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

    setText(text) {
        this.elms.editor.cursorPos = 0
        this.document.setText(text)
    }

    onTextUpdate() {
        if (this.document.text.length) {
            this.elms.placeholder.classList.add('invisible')
        } else {
            this.elms.placeholder.classList.remove('invisible')
        }

        const html = this.document.toHtml()
        this.elms.editor.innerHTML = html
        if (this.outputContainer)
            this.outputContainer.value = this.document.getFinalHtml()
        if (this.originalOutputContainer)
            this.originalOutputContainer.value = this.document.text
        this.elms.editor.setCursorPos(this.elms.editor.cursorPos)
    }

    initEditor() {
        if (this.document.text.length) {
            this.elms.placeholder.classList.add('invisible')
        } else {
            this.elms.placeholder.classList.remove('invisible')
        }

        this.elms.editor.initIO(this.document)
    }
}

customElements.define('baka-editor', BakaEditor)
