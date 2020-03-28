const express = require('express')
const fs = require('fs')
const app = express()
const decache = require('decache')
const cookieParser = require('cookie-parser')
var dateFormat = require('dateformat')
const chalk = require('chalk')

app.use('/dist', express.static('dist'))
app.use(cookieParser())

app.get('*', async function(req, res) {
  console.log(
    chalk.gray(`[${dateFormat(new Date(), 'h:MM:ss')}]`),
    chalk.blue('GET'),
    chalk.green(req.originalUrl)
  )

  decache(require.resolve('./dist/serverBundle'))
  decache(require.resolve('react'))
  decache(require.resolve('react-dom/server'))

  const ReactDOMServer = require('react-dom/server')
  const React = require('react')
  const { App, tree, template, routing } = require('./dist/serverBundle')

  const storedCookies = [
    {
      path: ['currentUser'],
      name: 'current_user'
    }
  ]

  for (const options of storedCookies) {
    if (!(`__stored_${options.name}` in req.cookies)) continue
    tree
      .select(options.path)
      .set(JSON.parse(req.cookies[`__stored_${options.name}`]))
  }

  let controller = routing[req.originalUrl]
  if (!controller) controller = routing[404]
  await controller.loadData(tree)

  const dehydratedContent = ReactDOMServer.renderToString(
    React.createElement(App, { store: tree, pathname: req.originalUrl })
  )
  const dehydratedState = JSON.stringify(tree.get())

  res.send(template({ dehydratedContent, dehydratedState }))
})

function startServer() {
  return app.listen(8989, function() {
    console.log(chalk.green('BlogFront listening on port 8989!'))
    console.log()
  })
}

let server = startServer()
