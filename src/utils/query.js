export default function encodeQueryData(obj, prefix) {
  let str = []
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      let k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p]
      str.push(
        v !== null && typeof v === 'object'
          ? encodeQueryData(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      )
    }
  }
  if (!prefix) return '?' + str.join('&')
  else return str.join('&')
}

export function parseParams(params) {
  if (!params) return
  const obj = {}
  if (params.startsWith('?')) params = params.slice(1, params.length)
  params.split('&').forEach((query) => {
    const data = query.split('=')
    obj[data[0]] = data[1]
  })
  return obj
}
