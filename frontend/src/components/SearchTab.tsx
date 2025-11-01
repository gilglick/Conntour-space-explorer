import { useState } from 'react'
import { ImageMeta, SortOrder } from '../types'
import SearchBar from './SearchBar'
import ImageCard from './ImageCard'
import Pagination from './Pagination'
import SortSelect from './SortSelect'

type Props = {
  query: string
  onQueryChange: (v: string) => void
  onSearch: () => void
  isLoading: boolean
  results?: { items: { image: ImageMeta, score: number }[], page: number, total: number, total_pages: number }
  onPageChange: (page: number) => void
}

export default function SearchTab({ 
  query, 
  onQueryChange, 
  onSearch, 
  isLoading, 
  results,
  onPageChange 
}: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('none')

  const sortedItems = !results ? [] : [...results.items].sort((a, b) => {
    if (sortOrder === 'none') return 0
    const aTitle = a.image.title.toLowerCase()
    const bTitle = b.image.title.toLowerCase()
    return sortOrder === 'az' 
      ? aTitle.localeCompare(bTitle)
      : bTitle.localeCompare(aTitle)
  })

  return (
    <>
      <div className="card">
        <SearchBar
          query={query}
          onQueryChange={onQueryChange}
          onSearch={onSearch}
          isLoading={isLoading}
        />
      </div>

      <div>
        <div>
          <h2>Search Results</h2>
          {results && <SortSelect value={sortOrder} onChange={setSortOrder} />}
        </div>
        {!results ? (
          <div>Run a search to see results.</div>
        ) : (
          <>
            <div className="grid">
              {sortedItems.map(({ image, score }) => (
                <ImageCard key={image.id} image={image} score={score} />
              ))}
            </div>
            <Pagination
              page={results.page}
              totalPages={results.total_pages}
              onPrev={() => onPageChange(results.page - 1)}
              onNext={() => onPageChange(results.page + 1)}
            />
          </>
        )}
      </div>
    </>
  )
}

