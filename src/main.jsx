import React from 'react'
import ReactDOM from 'react-dom/client'
import { inject } from '@vercel/analytics'
import TournamentTracker from '../tournament.jsx'

inject()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TournamentTracker />
  </React.StrictMode>,
)
