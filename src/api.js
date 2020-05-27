// @flow

import chalk from 'chalk'
import encodeQueryData from './utils/query'

declare var globalThis: {
  api_key: string | void,
  localStorage: any,
  ENV: { API: string },
}

export type User = {
  id: number,
  username: string,
  email: string,
  description: string,
  original_description: string,
  avatar_url: void | string,
  invites?: Invite[],
}

export type Invite = {
  id: number,
  code: string,
  description: string,
  creator: User,
  user: User,
  created_at: string,
  updated_at: string,
}

export type Post = {
  id: number,
  creator: User,
  title: string,
  text: string,
  original_text: string,
  created_at: string,
  updated_at: string,
}

function log(method, url) {
  console.log('%c%s', 'color: darkgreen;', `API ${method} - ${url}`)
}

async function POST(url: string, data?: any, signal: any): Promise<any> {
  // console.log(chalk.greenBright(`API POST - ${ENV.API + url}`))
  log('POST', ENV.API + url)
  const response = await fetch(globalThis.ENV.API + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization-Bearer': globalThis.api_key,
    },
    // mode: 'no-cors',
    body: JSON.stringify(data),
    signal,
  })

  return await response.json()
}

async function GET(url: string, data?: any, signal: any): Promise<any> {
  log('GET', ENV.API + url)
  const response = await fetch(
    globalThis.ENV.API + url + encodeQueryData(data),
    {
      method: 'GET',
      headers: {
        'X-Authorization-Bearer': globalThis.api_key,
      },
      signal,
    }
  )

  return await response.json()
}

async function DELETE(url: string, data?: any, signal: any): Promise<any> {
  log('DELETE', ENV.API + url)
  const response = await fetch(globalThis.ENV.API + url, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization-Bearer': globalThis.api_key,
    },
    body: JSON.stringify(data),
    signal,
  })

  return await response.json()
}

async function PATCH(url: string, data?: any, signal: any): Promise<any> {
  log('PATCH', ENV.API + url)
  const response = await fetch(globalThis.ENV.API + url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization-Bearer': globalThis.api_key,
    },
    body: JSON.stringify(data),
    signal,
  })

  return await response.json()
}

async function PATCH_FORM(url: string, data?: any, signal: any): Promise<any> {
  if (globalThis.api_key) {
    data = {
      ...data,
      api_key: globalThis.api_key,
    }
  }
  console.log(chalk.greenBright(`API PATCH - ${globalThis.ENV.API + url}`))

  const body = new FormData()

  Object.keys(data).forEach((key) => {
    if (!data[key]) return
    body.set(key, data[key])
  })

  const response = await fetch(globalThis.ENV.API + url, {
    method: 'PATCH',
    body,
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

export async function getPosts(
  cursor: number,
  limit: number
): Promise<{
  posts: Post[],
  pagination: {
    offset: number,
    total: number,
  },
}> {
  const data = {}
  if (cursor) data['cursor'] = cursor
  if (limit) data['limit'] = limit
  const resp = await GET('/posts', { pagination: data })
  return resp.result
}

export async function getPost(id: number): Promise<Post> {
  const resp = await GET(`/posts/${id}`)
  if (resp.code === 404) throw 'NotFound'
  return resp.result.post
}

export async function login(username: string, password: string): Promise<any> {
  const resp = await POST('/sessions', {
    user: { username, password },
  })

  if (resp.code !== 200) return resp

  if (globalThis.localStorage) {
    localStorage.setItem('api_key', resp.result.key)
    localStorage.setItem('session_id', resp.result.session.id)
    localStorage.setItem('current_user_id', resp.result.session.user_id)
  }

  return resp
}

export async function register(
  username: string,
  email: string,
  password: string,
  invite_code: string
): Promise<any> {
  const resp = await POST('/users', {
    user: { username, email, password, invite_code },
  })

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
  cursor: number,
  limit: number,
  signal: any
): Promise<Array<any>> {
  const resp = await GET(
    `/users/${username}/posts`,
    { pagintation: { cursor, limit } },
    signal
  )
  if (resp.code !== 200) {
    throw 'NotFound'
  }
  return resp.result
}

export async function deletePost(id: number): Promise<void> {
  const resp = await DELETE(`/posts/${id}`)
  if (resp.code !== 200) {
    throw 'NotFound'
  }
  return resp
}

export async function editUser(
  id: number,
  description: string,
  original_description: string,
  avatar?: Blob
): Promise<any> {
  const resp2 = await PATCH_FORM(`/users/${id.toString()}`, {
    'user[avatar]': avatar,
    'user[description]': description,
    'user[original_description]': original_description,
  })

  return resp2
}

export async function getUserInvites(
  id: number,
  signal?: any
): Promise<Invite[]> {
  const user = await getUser(id, signal)
  return user.invites || []
}

export async function createInvite(
  description?: string,
  signal: any
): Promise<Invite> {
  const resp = await POST('/invites', { description }, signal)
  return resp.result.invite
}
