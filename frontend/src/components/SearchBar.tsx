import { useCallback } from 'react'
import './SearchBar.css'

type Props = {
  query: string
  onQueryChange: (v: string) => void
  onSearch: () => void
  isLoading?: boolean
}

export default function SearchBar({ query, onQueryChange, onSearch, isLoading }: Props) {
  const handleSearch = useCallback(() => {
    if (isLoading) return
    onSearch()
  }, [isLoading, onSearch])

  return (
    <div className="row search-bar">
      <input
        type="text"
        placeholder='Type a natural language query, e.g. "images of Mars rovers"'
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  )
}
