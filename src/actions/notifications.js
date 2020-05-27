// @flow

export type Notification = {
  type: string,
  title: string,
  timer: number,
}

export const addNotification = (
  title: string,
  type: string = 'info',
  timer: number = 5
) => (tree) => {
  const notifications = tree.select('notifications').get()
  const maxId = notifications.reduce(
    (max, current) => (current.id > max ? current.id : max),
    -1
  )
  const id = maxId + 1
  tree.select('notifications').push({
    id,
    title,
    type,
    timer,
  })

  setTimeout(() => {
    removeNotification(id)(tree)
  }, timer * 1000)
}

export const removeNotification = (id: number) => (tree) => {
  const notifications: Array<Notification> = tree.select('notifications').get()
  const index = notifications.findIndex((el) => el.id === id)
  tree.select('notifications').splice([index, 1])
}
