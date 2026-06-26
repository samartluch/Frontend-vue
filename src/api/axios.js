import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout to prevent hanging
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Simple in-memory cache for GET requests
const cache = new Map()
const CACHE_DURATION = 30000 // 30 seconds

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle 401 and cache GET responses
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get') {
      const cacheKey = response.config.url + JSON.stringify(response.config.params || {})
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      })
    }
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Use window.location for a clean full page redirect to login
      // Using router would require importing it here, creating a circular dependency
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Helper to get cached data
api.getCached = function(url, params = {}, maxAge = CACHE_DURATION) {
  const cacheKey = url + JSON.stringify(params)
  const cached = cache.get(cacheKey)
  if (cached && (Date.now() - cached.timestamp) < maxAge) {
    return Promise.resolve({ data: cached.data })
  }
  return api.get(url, { params })
}

// Clear cache when mutations happen
api.clearCache = function() {
  cache.clear()
}

export default api