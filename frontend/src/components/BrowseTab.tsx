import { useState } from 'react'
import { ImageMeta, SortOrder } from '../types'
import ImageCard from './ImageCard'
import SortSelect from './SortSelect'

type Props = {
  sources?: { items: ImageMeta[], page: number, total: number, total_pages: number }
}

export default function BrowseTab({ sources }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('none')

  const sortedItems = sources ? [...sources.items].sort((a, b) => {
    if (sortOrder === 'none') return 0
    const aTitle = a.title.toLowerCase()
    const bTitle = b.title.toLowerCase()
    return sortOrder === 'az' 
      ? aTitle.localeCompare(bTitle)
      : bTitle.localeCompare(aTitle)
  }) : []

  return (
    <div>
      <div>
        <h2>Browse Images</h2>
        {sources && <SortSelect value={sortOrder} onChange={setSortOrder} />}
      </div>
      {!sources ? (
        <div>Loading...</div>
      ) : (
        <div className="grid">
          {sortedItems.map(img => <ImageCard key={img.id} image={img} />)}
        </div>
      )}
    </div>
  )
}

