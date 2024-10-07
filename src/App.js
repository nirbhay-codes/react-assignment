import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Dashboard from './components/Dashboard.js';
import { AuthProvider } from './context/AuthContext.js';
import PrivateRoute from './components/PrivateRoute.js';
import Welcome from './components/Welcome.js';
import Header from './components/Header.js';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Header />
        <Routes>
          {/* //TODO - add check where if user logged in then /login and /signup should navigate to /dashboard */}
          <Route path='/' element={<Welcome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
