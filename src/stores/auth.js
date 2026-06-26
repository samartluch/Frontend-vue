import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  async function login(email, password) {
    const response = await api.post('/login', { email, password })
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  }

  async function register(name, email, password, phone, address) {
    const response = await api.post('/register', { name, email, password, password_confirmation: password, phone, address })
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch (e) {
      // Even if API fails (e.g., token already expired), still clear local state
    }
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function fetchProfile() {
    const response = await api.get('/profile')
    user.value = response.data.user
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  }

  async function updateProfile(data) {
    const response = await api.put('/profile', data)
    user.value = response.data.user
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  }

  async function changePassword(currentPassword, newPassword) {
    const response = await api.put('/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword,
    })
    return response.data
  }

  return {
    user,
    token,
    isLoggedIn,
    currentUser,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
  }
})