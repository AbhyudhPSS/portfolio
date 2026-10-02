import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * The deployed origin, in exactly one place.
 *
 * Feeds four things that are wrong together or right together — the
 * canonical URL, the Open Graph image and URL, robots.txt and sitemap.xml.
 * Change it here and all four follow.
 */
const SITE_ORIGIN = 'https://abhyudhsolanki.in'

/** Substitutes %SITE_ORIGIN% into index.html and emits the crawler files. */
function siteOrigin(): Plugin {
  const origin = SITE_ORIGIN.replace(/\/$/, '')

  return {
    name: 'site-origin',
    config: () => ({ define: { __SITE_ORIGIN__: JSON.stringify(origin) } }),
    transformIndexHtml: (html) => html.replaceAll('%SITE_ORIGIN%', origin),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
      })

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      })

      // The 404 is authored as a standalone page; the host serves it for
      // unmatched paths (see README → Deploying).
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: readFileSync('src/404.html', 'utf8').replaceAll(
          '%SITE_ORIGIN%',
          origin,
        ),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteOrigin()],
  server: {
    // Vite does not read PORT on its own. Honouring it lets a host assign the
    // port; with nothing set, Vite falls back to its own default.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  build: {
    rollupOptions: {
      output: {
        // Split the two libraries out of the app chunk. They change on their
        // own schedule, so a content edit no longer invalidates 400kb of
        // vendor code in everyone's cache.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return
          if (/node_modules[/\\](react|react-dom|scheduler)[/\\]/.test(id)) {
            return 'react'
          }
          if (/node_modules[/\\]motion/.test(id)) return 'motion'
        },
      },
    },
  },
})
