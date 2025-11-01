import './SortSelect.css'

type SortOrder = 'none' | 'az' | 'za'

type Props = {
  value: SortOrder
  onChange: (value: SortOrder) => void
}

export default function SortSelect({ value, onChange }: Props) {
  return (
    <div className="sort-select">
      <p className="sort-select-label">Sort by:</p>
      <select value={value} onChange={(e) => onChange(e.target.value as SortOrder)}>
        <option value="none">No sort</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
      </select>
    </div>
  )
}

