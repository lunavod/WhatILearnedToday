const express = require('express')
const app = express()
const decache = require('decache')
const cookieParser = require('cookie-parser')
const dateFormat = require('dateformat')
const chalk = require('chalk')
const path = require('path')

require('dotenv').config()
globalThis.ENV = { API: process.env.API }

app.use('/dist', express.static('dist'))
app.use('/public', express.static('public'))
app.use(cookieParser())

app.get('*', async function (req, res) {
  console.time('request')
  try {
    decache(require.resolve('./dist/serverBundle'))
    decache(require.resolve('react'))
    decache(require.resolve('react-dom/server'))

    const ReactDOMServer = require('react-dom/server')
    const React = require('react')
    const {
      App,
      tree,
      template,
      getRouteForUrl,
    } = require('./dist/serverBundle')

    const storedCookies = [
      {
        path: ['logInData'],
        name: 'log_in_data',
      },
    ]

    for (const options of storedCookies) {
      if (!(`__stored_${options.name}` in req.cookies)) continue
      tree
        .select(options.path)
        .set(JSON.parse(req.cookies[`__stored_${options.name}`]))
    }

    globalThis.api_key = tree.select('logInData', 'api_key').get()

    let route = getRouteForUrl(req.originalUrl)
    let pathname = req.originalUrl
    let error = 0
    try {
      await route.loadData(tree, route.data)
      await route.default.loadData(tree)
    } catch (err) {
      if (err !== 'NotFound') error = 404
      else error = 500
      route = getRouteForUrl(`${error}`)
      pathname = `${error}`
    }

    const dehydratedContent = ReactDOMServer.renderToString(
      React.createElement(App, { store: tree, pathname, route })
    )
    const dehydratedState = JSON.stringify(tree.get())

    res.send(template({ dehydratedContent, dehydratedState, pathname }))

    console.log(
      chalk.gray(`[${dateFormat(new Date(), 'h:MM:ss')}]`),
      chalk.blue('GET'),
      chalk.green(req.originalUrl),
      chalk.blue(route.ControllerName)
    )
  } catch (err) {
    console.log(
      chalk.gray(`[${dateFormat(new Date(), 'h:MM:ss')}]`),
      chalk.blue('GET'),
      chalk.green(req.originalUrl),
      chalk.red('ERROR')
    )
    console.log(chalk.red(err))
    res.sendFile(path.resolve('./src/templates/error.html'))
    return
  }
  console.timeEnd('request')
})

function startServer() {
  return app.listen(8989, function () {
    console.log(chalk.green('BlogFront listening on port 8989!'))
    console.log()
  })
}

startServer()
