const http = require("http")
const fs = require("fs")
const path = require("path")
const { URL } = require("url")

const assetMap = require("./asset-map")

const HOST = process.env.HOST || "0.0.0.0"
const PORT = Number(process.env.PORT || 3000)
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").replace(/\/+$/, "")
const IMAGE_DIR = path.resolve(__dirname, "..", "image")

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  })
  res.end(JSON.stringify(payload))
}

function sendImage(res, filePath) {
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendJson(res, 404, {
        code: 404,
        message: "Image file not found."
      })
      return
    }

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": stats.size,
      "Cache-Control": "public, max-age=31536000, immutable"
    })

    fs.createReadStream(filePath).pipe(res)
  })
}

function getBaseUrl(req) {
  if (PUBLIC_BASE_URL) {
    return PUBLIC_BASE_URL
  }

  const forwardedProto = req.headers["x-forwarded-proto"]
  const forwardedHost = req.headers["x-forwarded-host"]
  const host = forwardedHost || req.headers.host || `127.0.0.1:${PORT}`
  const isLocalHost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(host)
  const protocol = forwardedProto || (isLocalHost ? "http" : "https")

  return `${protocol}://${host}`.replace(/\/+$/, "")
}

function buildHomeAssets(baseUrl) {
  return Object.keys(assetMap).reduce((result, key) => {
    result[key] = `${baseUrl}${assetMap[key].route}`
    return result
  }, {})
}

const fileRouteMap = Object.keys(assetMap).reduce((result, key) => {
  result[assetMap[key].route] = path.join(IMAGE_DIR, assetMap[key].sourceFile)
  return result
}, {})

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, "http://127.0.0.1")
  const pathname = requestUrl.pathname

  if (pathname === "/health") {
    sendJson(res, 200, {
      code: 0,
      message: "ok"
    })
    return
  }

  if (pathname === "/api/assets/home") {
    sendJson(res, 200, {
      code: 0,
      data: buildHomeAssets(getBaseUrl(req))
    })
    return
  }

  if (fileRouteMap[pathname]) {
    sendImage(res, fileRouteMap[pathname])
    return
  }

  sendJson(res, 404, {
    code: 404,
    message: "Not found."
  })
})

server.listen(PORT, HOST, () => {
  console.log(`Self-hosted asset server running on http://${HOST}:${PORT}`)
})
