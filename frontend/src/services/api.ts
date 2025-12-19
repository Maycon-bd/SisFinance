import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

// Interceptor to automatically add token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if NOT on login/register pages (to show login errors properly)
      const isAuthPage = window.location.pathname === '/login' || 
                         window.location.pathname === '/register' ||
                         window.location.pathname === '/forgot-password'
      if (!isAuthPage) {
        setAuthToken(undefined) // Remove token
        window.location.href = '/login' // Force redirect
      }
    }
    return Promise.reject(error)
  }
)

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}