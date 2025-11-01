import { SearchRecord } from '../types'
import './HistoryPanel.css'

type Props = {
  records: SearchRecord[]
  onOpen: (rec: SearchRecord) => void
  onDelete: (id: string) => void
}

export default function HistoryPanel({ records, onOpen, onDelete }: Props) {
  return (
    <div className="history-container">
      {records.map(record => (
        <div key={record.id} className="card">
          <div className="row history-header">
            <div>
              <p className="history-query">{record.query}</p>
              <div><p className="history-datetime">{new Date(record.created_at).toLocaleString()}</p></div>
            </div>
            <div className="row history-actions">
              <button onClick={() => onOpen(record)}>Open</button>
              <button onClick={() => onDelete(record.id)}>Delete</button>
            </div>
          </div>
          <hr className="separator" />
          <div className="row history-metadata">
            {record.results?.map((result, index) => (
              <img key={index} src={result.image.thumbnail || result.image.url} alt={result.image.title} className="history-metadata-item"/>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
