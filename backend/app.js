import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

const DATA_DIR = path.join(__dirname, 'data')
const SOURCES_PATH = path.join(DATA_DIR, 'sources.json')
const HISTORY_PATH = path.join(DATA_DIR, 'history.json')

function readJson(fp, fallback) {
  try { return JSON.parse(fs.readFileSync(fp, 'utf-8')) } catch { return fallback }
}
function writeJson(fp, obj) {
  fs.writeFileSync(fp, JSON.stringify(obj, null, 2), 'utf-8')
}
function paginate(items, page=1, pageSize=24) {
  const total = items.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    page,
    page_size: pageSize,
    total,
    total_pages: pageSize ? Math.ceil(total / pageSize) : 1,
    items: items.slice(start, end)
  }
}
const tokenRe = /[A-Za-z0-9]+/g
function tokenize(text='') { return (text.match(tokenRe) || []).map(t => t.toLowerCase()) }
function scoreItem(queryTokens, img) {
  const hay = [img.title || '', img.description || '', (img.keywords || []).join(' ')].join(' ')
  const htoks = new Set(tokenize(hay))
  if (!queryTokens.length || !htoks.size) return 0
  const qset = new Set(queryTokens)
  let inter = 0; for (const t of qset) if (htoks.has(t)) inter++
  const uni = new Set([...qset, ...htoks]).size || 1
  const jacc = inter / uni
  const title = (img.title || '').toLowerCase()
  const phrase = queryTokens.join(' ')
  const boost = phrase && title.includes(phrase) ? 0.15 : 0
  return Math.max(0, Math.min(1, jacc + boost))
}
function newId(prefix) {
  const ts = new Date().toISOString().replace(/[-T:.Z]/g, '')
  return `${prefix}_${ts}${Math.floor(Math.random()*1000)}`
}

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.get('/sources', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10))
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.page_size || '24', 10)))
  const imgs = readJson(SOURCES_PATH, [])
  res.json(paginate(imgs, page, pageSize))
})

app.get('/search', (req, res) => {
  const q = String(req.query.q || '')
  const page = Math.max(1, parseInt(req.query.page || '1', 10))
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.page_size || '24', 10)))
  const persist = String(req.query.persist || 'true') === 'true'

  const imgs = readJson(SOURCES_PATH, [])
  const qTokens = tokenize(q)
  let scored = imgs.map(img => ({ image: img, score: scoreItem(qTokens, img) }))
  if (qTokens.length) scored = scored.filter(s => s.score > 0)
  scored.sort((a,b) => b.score - a.score)
  const paged = paginate(scored, page, pageSize)

  if (persist) {
    const history = readJson(HISTORY_PATH, [])
    const rec = { id: newId('srch'), query: q, created_at: new Date().toISOString(), results: paged.items }
    history.unshift(rec)
    try { writeJson(HISTORY_PATH, history.slice(0, 500)) } catch {}
  }
  res.json(paged)
})

app.get('/history', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10))
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.page_size || '20', 10)))
  const hist = readJson(HISTORY_PATH, [])
  res.json(paginate(hist, page, pageSize))
})

app.delete('/history/:id', (req, res) => {
  const id = req.params.id
  const hist = readJson(HISTORY_PATH, [])
  const next = hist.filter(r => r.id !== id)
  if (next.length === hist.length) return res.status(404).json({ detail: 'Record not found' })
  writeJson(HISTORY_PATH, next)
  res.json({ ok: true, deleted: id })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Express API on http://localhost:${PORT}`))
