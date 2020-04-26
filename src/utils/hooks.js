import { useEffect, useState } from 'react'

export function useObserver(ref, attributeNames, callback) {
  useEffect(() => {
    const config = {
      attributes: true,
    }

    const wrapperCallback = (mutationList, observer) => {
      for (let mutation of mutationList) {
        if (attributeNames.indexOf(mutation.attributeName) >= 0) {
          callback(mutation)
        }
      }
    }

    const observer = new MutationObserver(wrapperCallback)
    observer.observe(ref.current, config)

    return () => {
      observer.disconnect()
    }
  })
}

export function useRouter() {
  const [url, setUrl] = useState(location.pathname)

  useEffect(() => {
    const onURLChange = (newURL) => {
      setUrl(newURL)
    }
    window.Router.addEventListener('change', onURLChange)

    return () => window.Router.removeEventListener('change', onURLChange)
  })

  return url
}
