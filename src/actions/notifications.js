export const addNotification = (title, type = 'info', timer = 5) => (tree) => {
  let notifications = tree.select('notifications').get()
  let maxId = notifications.reduce(
    (max, current) => (current.id > max ? current.id : max),
    -1
  )
  tree.select('notifications').push({
    id: maxId + 1,
    title,
    type,
    timer,
  })
}
