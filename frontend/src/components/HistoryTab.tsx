import { SearchRecord } from '../types'
import HistoryPanel from './HistoryPanel'
import Pagination from './Pagination'

type Props = {
  history?: { items: SearchRecord[], page: number, total: number, total_pages: number }
  onHistoryClick: (rec: SearchRecord) => void
  onDeleteHistory: (id: string) => void
  onPageChange: (page: number) => void
}

export default function HistoryTab({ 
  history, 
  onHistoryClick, 
  onDeleteHistory,
  onPageChange 
}: Props) {
  return (
    <div>
      <h2>Search History</h2>
      {!history ? (
        <div>Loading history...</div>
      ) : (
        <>
          <HistoryPanel
            records={history.items}
            onOpen={onHistoryClick}
            onDelete={onDeleteHistory}
          />
          <Pagination
            page={history.page}
            totalPages={history.total_pages}
            onPrev={() => onPageChange(history.page - 1)}
            onNext={() => onPageChange(history.page + 1)}
          />
        </>
      )}
    </div>
  )
}

