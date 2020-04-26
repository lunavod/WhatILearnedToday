// import hljs from 'highlight.js'
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.0/highlight.min.js'
)

onmessage = (event) => {
  const result = hljs.highlightAuto(event.data)
  postMessage(result.value)
}
