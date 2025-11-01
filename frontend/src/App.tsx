import { useEffect, useState, useMemo } from 'react'
import { listSources, searchImages, getHistory, deleteHistory } from './services/api'
import { ImageMeta, SearchRecord, Tab } from './types'
import Header from './components/Header'
import BrowseTab from './components/BrowseTab'
import SearchTab from './components/SearchTab'
import HistoryTab from './components/HistoryTab'

const PAGE_SIZE = 24
const HISTORY_PAGE_SIZE = 5

export default function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{items: {image: ImageMeta, score: number}[], page: number, total: number, total_pages: number}>()
  const [sources, setSources] = useState<{items: ImageMeta[], page: number, total: number, total_pages: number}>()
  const [history, setHistory] = useState<{items: SearchRecord[], page: number, total: number, total_pages: number}>()
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('browse')

  useEffect(() => {
    listSources(1, PAGE_SIZE).then(setSources)
    getHistory(1, HISTORY_PAGE_SIZE).then(setHistory)
  }, [])

  async function runSearch(page=1) {
    setLoading(true)
    try {
      const result = await searchImages(query, page, PAGE_SIZE, true)
      setResults(result)
      const hist = await getHistory(1, HISTORY_PAGE_SIZE)
      setHistory(hist)
      setTab('search')
    } finally {
      setLoading(false)
    }
  }

  async function onHistoryClick(record: SearchRecord) {
    setQuery(record.query)
    setLoading(true)
    try {
      const result = await searchImages(record.query, 1, PAGE_SIZE, false)
      setResults(result)
      setTab('search')
    } finally {
      setLoading(false)
    }
  }

  async function onDeleteHistory(id: string) {
    await deleteHistory(id)
    const currentPage = history?.page || 1
    const hist = await getHistory(currentPage, HISTORY_PAGE_SIZE)
    setHistory(hist)
  }

  async function loadHistory(page: number) {
    setLoading(true)
    try {
      const hist = await getHistory(page, HISTORY_PAGE_SIZE)
      setHistory(hist)
    } finally {
      setLoading(false)
    }
  }

  const tabContent = useMemo(() => {
    const content: Record<Tab, JSX.Element> = {
      browse: <BrowseTab sources={sources} />,
      search: (
        <SearchTab
          query={query}
          onQueryChange={setQuery}
          onSearch={() => runSearch(1)}
          isLoading={loading}
          results={results}
          onPageChange={runSearch}
        />
      ),
      history: (
        <HistoryTab
          history={history}
          onHistoryClick={onHistoryClick}
          onDeleteHistory={onDeleteHistory}
          onPageChange={loadHistory}
        />
      ),
    }
    return content[tab]
  }, [tab, sources, query, loading, results, history])

  return (
    <div className="container">
      <Header currentTab={tab} onTabChange={setTab} />
      {tabContent}
    </div>
  )
}
