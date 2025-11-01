
import { ImageMeta, SearchRecord } from '../types'

const base = '/api'

export async function listSources(page=1, pageSize=24): Promise<{items: ImageMeta[], page: number, total: number, total_pages: number}> {
  const r = await fetch(`${base}/sources?page=${page}&page_size=${pageSize}`)
  return r.json()
}

export async function searchImages(q: string, page=1, pageSize=24, persist=true): Promise<{items: {image: ImageMeta, score: number}[], page: number, total: number, total_pages: number}> {
  const r = await fetch(`${base}/search?q=${encodeURIComponent(q)}&page=${page}&page_size=${pageSize}&persist=${persist}`)
  return r.json()
}

export async function getHistory(page=1, pageSize=20): Promise<{items: SearchRecord[], page: number, total: number, total_pages: number}> {
  const r = await fetch(`${base}/history?page=${page}&page_size=${pageSize}`)
  return r.json()
}

export async function deleteHistory(id: string): Promise<{ok: boolean, deleted: string}> {
  const r = await fetch(`${base}/history/${id}`, { method: 'DELETE' })
  if (!r.ok) throw new Error('Failed to delete')
  return r.json()
}
