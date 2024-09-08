import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import JogoDavelha from './JogoDavelha.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <JogoDavelha />
  </>
  // </StrictMode>
)
