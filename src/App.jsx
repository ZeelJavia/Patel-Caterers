// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EventForm from './pages/EventForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-event" element={<EventForm />} />
        <Route path="/edit-event/:id" element={<EventForm />} />
      </Routes>
    </Router>
  );
}

export default App;