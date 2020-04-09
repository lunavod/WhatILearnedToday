// @flow

import chalk from 'chalk'

declare var globalThis: {
  api_key: string | void,
  localStorage: any,
  ENV: { API: string },
}

async function POST(url: string, data?: any, signal: any): Promise<any> {
  if (globalThis.api_key) {
    data = {
      ...data,
      api_key: globalThis.api_key,
    }
  }

  console.log(chalk.greenBright(`API POST - ${ENV.API + url}`))
  const response = await fetch(globalThis.ENV.API + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // mode: 'no-cors',
    body: JSON.stringify(data),
    signal,
  })

  return await response.json()
}

async function GET(url: string, data?: any, signal: any): Promise<any> {
  if (globalThis.api_key) {
    data = {
      ...data,
      api_key: globalThis.api_key,
    }
  }
  console.log(chalk.greenBright(`API GET - ${globalThis.ENV.API + url}`))
  const response = await fetch(globalThis.ENV.API + url, {
    method: 'GET',
    signal,
  })

  return await response.json()
}

async function DELETE(url: string, data?: any, signal: any): Promise<any> {
  if (globalThis.api_key) {
    data = {
      ...data,
      api_key: globalThis.api_key,
    }
  }
  console.log(chalk.greenBright(`API DELETE - ${globalThis.ENV.API + url}`))
  const response = await fetch(globalThis.ENV.API + url, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal,
  })

  return await response.json()
}

async function PATCH(url: string, data?: any, signal: any): Promise<any> {
  if (globalThis.api_key) {
    data = {
      ...data,
      api_key: globalThis.api_key,
    }
  }
  console.log(chalk.greenBright(`API PATCH - ${globalThis.ENV.API + url}`))
  const response = await fetch(globalThis.ENV.API + url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal,
  })

  return await response.json()
}

export async function addPost(
  title: string,
  text: string,
  original_text: string
): Promise<any> {
  return await POST('/posts', {
    post: { title, text, original_text },
  })
}

export async function editPost(
  id: number,
  title: string,
  text: string,
  original_text: string
): Promise<any> {
  return await PATCH(`/posts/${id.toString()}`, {
    post: { title, text, original_text },
  })
}

export async function getPosts(): Promise<Array<any>> {
  return (await GET('/posts')).posts
}

export async function login(username: string, password: string): Promise<any> {
  const resp = await POST('/sessions', {
    user: { username, password },
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
  const resp = await POST('/users', {
    user: { username, email, password },
  })

  console.log('Register!', username, email, password, resp)

  if (resp.code !== 201) return resp

  return await login(username, password)
}

export async function getUser(id: number, signal: any): Promise<any> {
  const resp = await GET('/users/' + id, {}, signal)
  if (resp.code !== 200) {
    throw 'NotFound'
  }
  return resp.result.user
}

export async function getUserPosts(
  username: string,
  signal: any
): Promise<Array<any>> {
  const resp = await GET(`/users/${username}/posts`, {}, signal)
  if (resp.code !== 200) {
    throw 'NotFound'
  }
  return resp.result.posts
}

export async function deletePost(id: number): Promise<void> {
  const resp = await DELETE(`/posts/${id}`)
  if (resp.code !== 200) {
    throw 'NotFound'
  }
  return resp
}
