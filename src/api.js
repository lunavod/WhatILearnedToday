// @flow

declare var globalThis: { api_key: string | void, localStorage: any }

async function post(url: string, data?: any): Promise<any> {
  if (globalThis.api_key) {
    data = {
      ...data,
      api_key: globalThis.api_key
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

async function get(url: string, data?: any): Promise<any> {
  if (globalThis.api_key) {
    data = {
      ...data,
      api_key: globalThis.api_key
    }
  }
  const response = await fetch(url, {
    method: 'GET'
  })

  return await response.json()
}

export async function addPost(title: string, text: string): Promise<any> {
  return await post('http://localhost:9999/posts', {
    post: { title, text }
  })
}

export async function getPosts(): Promise<Array<any>> {
  return (await get('http://localhost:9999/posts')).posts
}

export async function login(username: string, password: string): Promise<any> {
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

export async function register(
  username: string,
  email: string,
  password: string
): Promise<any> {
  const resp = await post('http://localhost:9999/users', {
    user: { username, email, password }
  })

  console.log('Register!', username, email, password, resp)

  if (resp.code !== 201) return resp

  return await login(username, password)
}

export async function getUser(id: number): Promise<any> {
  const resp = await get('http://localhost:9999/users/' + id)
  if (resp.code !== 200) {
    throw 'NotFound'
  }
  return resp.result.user
}
