const express = require('express');
const fs = require('fs')
const app = express();
const decache = require('decache')

app.use('/dist', express.static('dist'));

app.get('*', async function (req, res) {
  console.log(req.originalUrl)
  decache(require.resolve('./dist/serverBundle'))
  decache(require.resolve('react'))
  decache(require.resolve('react-dom/server'))
  
  const ReactDOMServer = require('react-dom/server');
  const React = require('react')
  const {App, tree, template, routing} = require('./dist/serverBundle')
  
  let controller = routing[req.originalUrl]
  if (!controller) controller = routing[404]
  await controller.loadData(tree)

  const dehydratedContent = ReactDOMServer.renderToString(React.createElement(App, {store: tree, pathname: req.originalUrl}))
  const dehydratedState = JSON.stringify(tree.get())

  res.send(template({dehydratedContent, dehydratedState}))
});

let killed = false
// if (fs.existsSync('./tmp/pid')) {
//   try {
//     process.kill(fs.readFileSync('./tmp/pid').toString(), 'SIGUSR2');
//     killed = true
//   } catch (err) {
//     if (err.code !== 'ESRCH') {
//       console.log(err)
//       throw(err)
//     }
//   }
// }
// fs.writeFileSync('./tmp/pid', process.pid)

let server;
function startServer() {
  return app.listen(8989, function () {
    console.log('Example app listening on port 8989!');
  })
}

setTimeout(() => {
  server = startServer()
}, killed? 100 : 0);

// process.once('SIGUSR2', function () {
//   server.close()
//   if (fs.existsSync('./tmp/pid')) fs.unlinkSync('./tmp/pid')
//   setTimeout(() => process.kill(process.pid, 'SIGKILL'), 500)
// });