import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import './logrocket'

navigator.serviceWorker.register('./sw.js', { scope: '/' })

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
