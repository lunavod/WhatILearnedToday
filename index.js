const express = require('express');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs')

import React from 'react'
import App from './src/components/App'
import tree from './src/store'
var template = require("ejs-loader!./src/templates/index.html.ejs");

const app = express();

app.use('/dist', express.static('dist'));

app.get('/', function (req, res) {
  const dehydratedContent = ReactDOMServer.renderToString(<App store={tree} />)
  const dehydratedState = JSON.stringify(tree.get())

  res.send(template({dehydratedContent, dehydratedState}))
});

let killed = false
if (fs.existsSync('./tmp/pid')) {
  try {
    process.kill(fs.readFileSync('./tmp/pid').toString(), 'SIGUSR2');
    killed = true
  } catch (err) {
    if (err.code !== 'ESRCH') {
      console.log(err)
      throw(err)
    }
  }
}
fs.writeFileSync('./tmp/pid', process.pid)

let server;
function startServer() {
  return app.listen(8989, function () {
    console.log('Example app listening on port 8989!');
  })
}

setTimeout(() => {
  server = startServer()
}, killed? 100 : 0);

process.once('SIGUSR2', function () {
  server.close()
  if (fs.existsSync('./tmp/pid')) fs.unlinkSync('./tmp/pid')
  setTimeout(() => process.kill(process.pid, 'SIGKILL'), 500)
});