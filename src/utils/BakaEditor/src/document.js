// @flow

type InsertEvent = {
    type: 'insert',
    start: number,
    value: string,
}

type DeleteEvent = {
    type: 'delete',
    start: number,
    n: number,
    dir: 'back' | 'forward',
}

type SetTextEvent = {
    type: 'set text',
    text: string,
}

export default class Document {
    //    text = 'aabb\nbbaa'
    text = ''
    history: Array<InsertEvent | DeleteEvent | SetTextEvent> = []

    beforeDelete(start: number, n: number) {}
    beforeInsert(start: number, text: string) {}

    getStylesAtOffset(offset: number) {
        let styles = {}
        for (let styleName in this.styles) {
            for (let i = 0; i < this.styles[styleName].ranges.length; i++) {
                let range = this.styles[styleName].ranges[i]
                if (!(range[0] < offset && range[1] >= offset)) continue
                styles[styleName] = range
            }
        }
        return styles
    }

    getStylesAtRange(start: number, end: number) {
        let styles = []
        for (let styleName in this.styles) {
            for (let i = 0; i < this.styles[styleName].ranges.length; i++) {
                let range = this.styles[styleName].ranges[i]
                if (
                    !(
                        (
                            (range[0] >= start && range[0] < end) || // Начало в выделении
                            (range[1] > start && range[1] <= end) || // Конец в выделении
                            (range[0] <= start && range[1] >= end)
                        ) // Выделение между началом и концом
                    )
                )
                    continue
                styles.push(styleName)
            }
        }
        return styles
    }

    setText(text) {
        const historyItem: SetTextEvent = { type: 'set text', text }
        this.history = [historyItem]
        this.text = text
        this.fireUpdate(historyItem)
    }

    insert(start: number, value: string): void {
        const historyItem: InsertEvent = { type: 'insert', value, start }
        this.history.push(historyItem)

        this.beforeInsert(start, value)

        let arr = Array.from(this.text)
        arr.splice(start, 0, value)
        this.text = arr.join('')

        this.fireUpdate(historyItem)
    }

    replace(start: number, end: number, value: string): void {
        this.delete(start, end - start)
        if (value) this.insert(start, value)
    }

    delete(start: number, n: number, dir: 'back' | 'forward' = 'back') {
        const historyItem: DeleteEvent = { type: 'delete', n, start, dir }
        this.history.push(historyItem)

        this.beforeDelete(start, n)

        let arr = Array.from(this.text)
        arr.splice(start, n)
        this.text = arr.join('')

        this.fireUpdate(historyItem)
    }

    listeners: { [string]: Array<(event: mixed) => void> } = {}

    addEventListener(event: string, callback: (event: mixed) => void): void {
        if (this.listeners[event]) {
            this.listeners[event].push(callback)
        } else {
            this.listeners[event] = [callback]
        }
    }

    fireUpdate(event: mixed): void {
        const callbacks = this.listeners['update']
        if (!callbacks) return
        callbacks.forEach((callback) => callback(event))
    }

    toHtml(): string {
        if (!this.text.length) return '<div class="empty">&#8203;</div>'
        let allRanges: Array<{ style: string, range: [number, number] }> = []
        let lines = [[]]
        let result = ''

        for (let styleName in this.styles) {
            for (let range of this.styles[styleName].ranges) {
                allRanges.push({ style: styleName, range })
            }
        }

        const getStylesAtOffset = (offset: number): string[] => {
            return allRanges
                .filter((rangeData) => {
                    let range = rangeData.range
                    return range[0] <= offset && range[1] > offset
                })
                .map((rangeData) => rangeData.style)
        }

        const stylesEqual = (a: string[], b: string[]) => {
            if (a.length !== b.length) return false
            return !a.filter((el) => b.indexOf(el) < 0).length
        }

        let currentNode: {
            styles: string[],
            text: string,
            start: number,
            end: number,
        } = {
            styles: getStylesAtOffset(0),
            text: this.text[0],
            start: 0,
            end: 1,
        }
        let currentLine = 0
        for (let i = 1; i < this.text.length; i++) {
            let ch = this.text[i]
            let styles = getStylesAtOffset(i)

            if (stylesEqual(currentNode.styles, styles) && ch !== '\n') {
                currentNode.end = i
                currentNode.text += ch
                continue
            }

            lines[currentLine].push(currentNode)
            if (ch === '\n') {
                currentLine++
                lines.push([])
                // continue
            }
            currentNode = {
                styles,
                text: ch,
                start: i,
                end: i + 1,
            }
        }
        lines[currentLine].push(currentNode)

        let x = 0
        for (let nodes of lines) {
            let lineText = ''
            let lineLength = 0
            for (let node of nodes) {
                let start = node.styles
                    .map((styleName) => this.styles[styleName].openTag)
                    .join('')
                let end = node.styles
                    .map((styleName) => this.styles[styleName].closeTag)
                    .join('')
                lineText += start + node.text + end
                if (node.text !== '\n') lineLength += node.text.length
            }
            result += `${x ? '\n' : ''}<div${
                lineText === '\n' ? ' class="empty"' : ''
            }>${!lineLength ? '' : lineText.replace(/\n/g, '')}</div>`
            x++
        }

        return result
    }
}
