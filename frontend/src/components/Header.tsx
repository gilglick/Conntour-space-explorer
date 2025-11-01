import { Tab } from "../types"

type Props = {
  currentTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function Header({ currentTab, onTabChange }: Props) {
  return (
    <div className="header-container">
      <h1>Conntour - Space Explorer</h1>
      <nav className="row">
        <button onClick={() => onTabChange('browse')} disabled={currentTab === 'browse'}>Browse</button>
        <button onClick={() => onTabChange('search')} disabled={currentTab === 'search'}>Search</button>
        <button onClick={() => onTabChange('history')} disabled={currentTab === 'history'}>History</button>
      </nav>
    </div>
  )
}

