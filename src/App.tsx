import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ResultsPage from './components/ResultsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results/:address" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
