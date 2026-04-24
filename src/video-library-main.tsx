import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VideoLibrary from './VideoLibrary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VideoLibrary />
  </StrictMode>,
)
