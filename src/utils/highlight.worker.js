import hljs from 'highlight.js'

onmessage = (event) => {
  const result = hljs.highlightAuto(event.data)
  console.log(event, result)
  postMessage(result.value)
}
