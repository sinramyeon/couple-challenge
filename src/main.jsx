import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BearPreview from './components/BearPreview.jsx'
import './index.css'

const isPreview = new URLSearchParams(window.location.search).get('preview') === 'bear'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isPreview ? <BearPreview /> : <App />}
  </React.StrictMode>,
)
