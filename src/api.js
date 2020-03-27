async function post(url, data) {
  if (globalThis.localStorage) {
    const api_key = localStorage.getItem('api_key')
    data = {
      ...data,
      api_key
    }
  }
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
  if (globalThis.localStorage) {
    const api_key = localStorage.getItem('api_key')
    data = {
      ...data,
      api_key
    }
  }
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

export async function login(username, password) {
  const resp = await post('http://localhost:9999/sessions', {
    user: { username, password }
  })

  console.log(resp)

  if (resp.code !== 200) return resp

  if (globalThis.localStorage) {
    localStorage.setItem('api_key', resp.result.key)
    localStorage.setItem('session_id', resp.result.session.id)
    localStorage.setItem('current_user_id', resp.result.session.user_id)
  }

  console.log('Login!', resp.result.key)

  return resp
}

export async function register(username, email, password) {
  const resp = await post('http://localhost:9999/users', {
    user: { username, email, password }
  })

  console.log('Register!', username, email, password, resp)

  if (resp.code !== 201) return resp

  return await login(username, password)
}
