async function post(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // mode: 'no-cors',
    body: JSON.stringify(data)
  })

  return await response.json()
}

async function get(url, data) {
  const response = await fetch(url, {
    method: 'GET'
  })

  return await response.json()
}

export async function addPost(title, text) {
  return await post('http://localhost:9999/posts', { post: { title, text } })
}

export async function getPosts() {
  return await get('http://localhost:9999/posts')
}

globalThis.addPost = addPost
