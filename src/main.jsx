import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import DevApp from './DevApp.jsx'
import BearPreview from './components/BearPreview.jsx'
import './index.css'

const params = new URLSearchParams(window.location.search)
const isPreview = params.get('preview') === 'bear'
const isDev = params.get('dev') === 'true'

function Root() {
  if (isPreview) return <BearPreview />
  if (isDev) return <DevApp />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
