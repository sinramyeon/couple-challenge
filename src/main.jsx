import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BearPreview from './components/BearPreview.jsx'
import './index.css'

const params = new URLSearchParams(window.location.search)
const isPreview = params.get('preview') === 'bear'
const isDev = import.meta.env.DEV && params.get('dev') === 'true'

function Root() {
  if (isPreview) return <BearPreview />
  if (isDev) {
    const DevApp = React.lazy(() => import('./DevApp.jsx'))
    return <React.Suspense fallback={<div>Loading dev...</div>}><DevApp /></React.Suspense>
  }
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
