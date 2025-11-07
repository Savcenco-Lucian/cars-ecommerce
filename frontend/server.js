import fs from 'node:fs/promises'
import express from 'express'
import axios from 'axios'
import 'dotenv/config'

const serverApi = axios.create({
  baseURL: process.env.SERVER_API_URL || process.env.VITE_API_URL || 'http://localhost:8000',
})

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.get('/sitemap.xml', async (req, res) => {
  res.sendFile(process.cwd() + '/sitemap.xml', {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
});

const fetchListingData = async (slug) => {

  const parts = slug.split('-');
  const id = parts.pop();

  try {
    const res = await serverApi.get(`/car-listings/${id}/`)
    return res.data;
  } catch (error) {
    console.error("Error fetching listing")
  }

  return null
}

app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.js').render} */
    let render
    if (!isProduction) {
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    let dynamicHead = ''
    const m = url.match(/^\/listing\/([^\/?#]+)/)
    if (m && m[1]) {
      const slug = decodeURIComponent(m[1])
      const listing = await fetchListingData(slug)

      if (listing) {
        dynamicHead = `
          <title>${listing.title} | Zoom Vintage Classics</title>
          <meta name="description" content="${listing.description}" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://zoom-vintageclassics.com/listing/${slug}" />
          <meta property="og:title" content="${listing.title} | Zoom Vintage Classics" />
          <meta property="og:description" content="${listing.description}" />
          <meta property="og:image" content="${listing.listing_images[0].path}" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${listing.title} | Zoom Vintage Classics" />
          <meta name="twitter:description" content="${listing.description}" />
          <meta name="twitter:image" content="${listing.listing_images[0].path}" />
        `
      }
    }

    const rendered = await render(url)

    const html = template
      .replace('<!--app-head-->', `${dynamicHead}${rendered.head ?? ''}`)
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
