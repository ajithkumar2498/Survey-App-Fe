import './App.css'
import { AuthProvider } from './Context/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import CreateSurvey from './pages/CreateSurvey'
import TakeSurvey from './pages/TakeSurvey'
import Analytics from './pages/Analytics'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Register from './pages/RegisterPage'

function App() {


  return (
    <>
     <AuthProvider>
      <BrowserRouter>
      <Routes>
        
        {/* 1. PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/survey/:id" element={<TakeSurvey />} />

        {/* 2. PROTECTED ROUTES*/}
        <Route element={<Layout />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/create" element={<CreateSurvey />} />
           <Route path="/analytics/:id" element={<Analytics />} />
           {/* default redirect if logged in */}
           <Route path="/" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
      <Toaster />
    </AuthProvider>
    </>
  )
}

export default App
