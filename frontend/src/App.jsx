import React from 'react'

function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>SITA - S1 Teknik Informatika</h1>
      <p>Frontend React + Backend Flask + MongoDB.</p>
      <ul>
        <li>API base URL dikontrol via environment VITE_API_BASE_URL</li>
        <li>Cek endpoint backend: /api/ping dan /health</li>
      </ul>
    </main>
  )
}

export default App
