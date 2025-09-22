import React, { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.login(credentials)
      setUser(response.data.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.'
      setError(errorMessage)
      console.error('Login failed:', errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.register(userData)
      setUser(response.data.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.'
      setError(errorMessage)
      console.error('Registration failed:', errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
      // Clear user even if logout request fails
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const clearError = () => setError(null)

  // Check authentication status on app load
  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/api/v1/users/me')
      setUser(response.data.data)
      setIsAuthenticated(true)
    } catch (error) {
      // Silently handle auth check failure - user is not logged in
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
