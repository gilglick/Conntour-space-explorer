type Props = {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export default function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  return (
    <div className="row pagination">
      <p>Page {page} of {totalPages}</p>
      <span className="pagination-spacer" />
      <button disabled={page <= 1} onClick={onPrev}>Prev</button>
      <button disabled={page >= totalPages} onClick={onNext}>Next</button>
    </div>
  )
}

