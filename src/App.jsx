import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Loans from './pages/Loans'
import Users from './pages/Users'
import ProtectedRoute from './components/ProtectedRoute'


function App() {

  return (
    <Routes>
      {/* Ruta publica */}
      <Route path="/" element={<Home />} />

      {/* Ruta de Login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
      <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
