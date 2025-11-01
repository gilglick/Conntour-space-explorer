import { ImageMeta } from '../types'
import './ImageCard.css'

export default function ImageCard({ image, score }: { image: ImageMeta, score?: number }) {
  return (
    <div className="card">
      <a href={image.url} target="_blank" rel="noreferrer">
        <img className="thumb" src={image.thumbnail || image.url}/>
      </a>
      <div className="image-card-content">
        <div className="row image-card-header">
          <p className="image-card-title">{image.title}</p>
          {typeof score === 'number' && (
            <span className="badge">confidence: {Math.round(score*100)}%</span>
          )}
        </div>
        <div className="meta">
          <p className="image-card-description">{image.description}</p>
          {image.keywords.length > 0 ? (
            <div className="keywords-container">
              {image.keywords.map(k => <span key={k} className="badge keyword-badge">{k}</span>)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
