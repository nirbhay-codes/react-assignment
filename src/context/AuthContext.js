import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Restore user from localStorage
    }
  }, []);

  // Signup function
  const signup = async (email, password, navigate) => {
    const newUser = { email, password };
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
      navigate('/dashboard'); // Redirect to dashboard after signup
    } catch (error) {
      alert(error.message);
    }
  };

  // Login function
  const login = async (email, password, navigate) => {
    const user = { email, password };
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (error) {
      alert(error.message);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
