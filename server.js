const { createServer } = require('http')
const  { URL }  = require('url')
const path = require('path')
const fs = require('fs')
const mimeTypes = {
  'text': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'js': 'text/javascript'
}
const port = 3000
const baseURL = `http://localhost:${port}`

const notFound = function (res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.write('404 Not Found\n')
  res.end()
}

const handler = function (req, res) {

  const { pathname } = new URL(req.url, baseURL)
  let filename = path.join(process.cwd(), unescape(pathname))
  let stats

  try {
    stats = fs.lstatSync(filename)

    if (stats.isSymbolicLink()) {
      filename = fs.realpathSync(filename)
      stats = fs.lstatSync(filename)
    }
  } catch (e) {
    return notFound(res)
  }

  if (stats.isDirectory()) {
    filename = path.join(filename, 'index.html')
    try {
      stats = fs.lstatSync(filename)
    } catch (e) {
      return notFound(res)
    }
  }

  const fileExtension = path.extname(filename).slice(1)

  if (stats.isFile()) {
    const mimeType = mimeTypes[fileExtension || 'text']
    res.writeHead(200, { 'Content-Type': mimeType })

    const fileStream = fs.createReadStream(filename)
    fileStream.pipe(res)
  } else {
    res.writeHead(500, { 'Content-Type': mimeTypes.text })
    res.write('500 Internal server error\n')
    res.end()
  }
}

createServer(handler).listen(port)

console.log(`Listening at ${baseURL}`)
