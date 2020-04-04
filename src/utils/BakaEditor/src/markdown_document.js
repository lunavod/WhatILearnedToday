// @flow

import Document from './document'

export default class MarkdownDocument extends Document {
    // text = '*Привет*, **мир**!\n***Сегодня*** __я__ ~~делаю~~ `маркдаун`!'

    set styles(value: any) {}
    get styles() {
        let ranges: {
            [string]: [number, number][],
        } = {
            bold: [],
            italic: [],
            underline: [],
            strike: [],
            monospace: [],
            service: [],
        }

        const process = (styleNames, regexp, n) => {
            this.text.replace(regexp, (fullMatch, match, index) => {
                let start = index + n
                let end = index + fullMatch.length - n
                for (let styleName of styleNames) {
                    ranges[styleName].push([start, end])
                }
                ranges.service.push([start - n, start])
                ranges.service.push([end, end + n])
                return match
            })
        }

        process(
            ['bold'],
            /(?<!\*|\\\*)\*{2,2}[^*\n](.+?)[^*]\*{2,2}(?!\*|\\)/gm,
            2
        )
        process(['italic'], /((?<!\*|\\)\*[^*\n].+?[^*|\\]\*(?!\*))/gm, 1)
        process(
            ['bold', 'italic'],
            /(?<!\*|\\)\*{3,3}[^*\n](.+?)[^*|\\]\*{3,3}(?!\*)/gm,
            3
        )
        process(['underline'], /__(.+?)__/gm, 2)
        process(['strike'], /~~(.+?)~~/gm, 2)
        process(['monospace'], /`([^`]*)`/, 1)

        return {
            bold: {
                openTag: '<b>',
                closeTag: '</b>',
                ranges: ranges.bold,
            },
            italic: {
                openTag: '<i>',
                closeTag: '</i>',
                ranges: ranges.italic,
            },
            underline: {
                openTag: '<u>',
                closeTag: '</u>',
                ranges: ranges.underline,
            },
            strike: {
                openTag: '<s>',
                closeTag: '</s>',
                ranges: ranges.strike,
            },
            monospace: {
                openTag: '<span class="monospace">',
                closeTag: '</span>',
                ranges: ranges.monospace,
            },
            service: {
                openTag: '<span class="service">',
                closeTag: '</span>',
                ranges: ranges.service,
            },
        }
    }

    getStylesAtOffset(offset: number) {
        let styles: {
            [string]: [number, number],
        } = {}
        for (let styleName in this.styles) {
            for (let i = 0; i < this.styles[styleName].ranges.length; i++) {
                let range = this.styles[styleName].ranges[i]
                if (!(range[0] <= offset && range[1] >= offset)) continue
                styles[styleName] = range
            }
        }
        return styles
    }

    getStylesAtRange(start: number, end: number) {
        let styles: string[] = []
        for (let styleName in this.styles) {
            for (let i = 0; i < this.styles[styleName].ranges.length; i++) {
                let range: [number, number] = this.styles[styleName].ranges[i]
                if (
                    !(
                        (
                            (range[0] >= start && range[0] <= end) || // Начало в выделении
                            (range[1] >= start && range[1] <= end) || // Конец в выделении
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

    getFinalHtml() {
        let html = this.toHtml()
        return html.replace(/<span class="service">(.+?)<\/span>/gm, '')
    }
}
