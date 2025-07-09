import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Carte from './pages/Carte';
import Documentation from './pages/Documentation';

// import './App.css'
import './output.css'

function App() {
  
  return (
      <Router>
      <Routes>
        <Route path="/carto-risque-clim/" element={<Carte/>} />
        <Route path="/carto-risque-clim/documentation" element={<Documentation/>} />
      </Routes>
    </Router>
  )
}

export default App
