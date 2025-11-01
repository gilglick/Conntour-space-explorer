
export type ImageMeta = {
  id: string
  title: string
  description: string
  date: string
  url: string
  thumbnail?: string
  keywords: string[]
}

export type SearchItem = {
  image: ImageMeta
  score: number
}

export type SearchRecord = {
  id: string
  query: string
  created_at: string
  results: SearchItem[]
}

export type Tab = 'browse' | 'search' | 'history'
export type SortOrder = 'none' | 'az' | 'za'