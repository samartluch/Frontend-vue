<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <router-link to="/" class="navbar-brand">
        <span class="brand-icon">🛍️</span>
        <span class="brand-text">ShopEase</span>
      </router-link>

      <div class="navbar-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          @keyup.enter="searchProducts"
        />
        <button class="search-btn" @click="searchProducts" title="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <div class="navbar-links">
        <router-link to="/" class="nav-link" active-class="active-link" :class="{ active: route.path === '/' }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </router-link>
        <router-link to="/products" class="nav-link" active-class="active-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          Products
        </router-link>

        <template v-if="auth.isLoggedIn">
          <router-link to="/wishlist" class="nav-link icon-link" active-class="active-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="nav-label">Wishlist</span>
          </router-link>
          <router-link to="/cart" class="nav-link icon-link" active-class="active-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="nav-label">Cart</span>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>
          <router-link to="/orders" class="nav-link" active-class="active-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            Orders
          </router-link>
          
          <div class="dropdown">
            <button class="dropdown-toggle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span class="user-name">{{ auth.currentUser?.name }}</span>
            </button>
            <div class="dropdown-menu">
              <router-link to="/profile" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Profile
              </router-link>
              <router-link to="/orders" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                My Orders
              </router-link>
              <hr class="dropdown-divider" />
              <button class="dropdown-item logout-item" @click="handleLogout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <router-link to="/login" class="btn btn-outline btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            Login
          </router-link>
          <router-link to="/register" class="btn btn-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Register
          </router-link>
        </template>
      </div>

      <button class="mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen" :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'">
        <svg v-if="!mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Mobile Search Bar -->
    <div class="mobile-search-bar">
      <input
        v-model="mobileSearchQuery"
        type="text"
        placeholder="Search products..."
        @keyup.enter="searchProductsMobile"
      />
      <button class="search-btn" @click="searchProductsMobile">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="mobile-menu">
      <router-link to="/" class="mobile-link" @click="mobileMenuOpen = false" exact-active-class="mobile-active">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        Home
      </router-link>
      <router-link to="/products" class="mobile-link" @click="mobileMenuOpen = false" active-class="mobile-active">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
        Products
      </router-link>
      <template v-if="auth.isLoggedIn">
        <router-link to="/wishlist" class="mobile-link" @click="mobileMenuOpen = false" active-class="mobile-active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          Wishlist
        </router-link>
        <router-link to="/cart" class="mobile-link" @click="mobileMenuOpen = false" active-class="mobile-active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Cart
          <span v-if="cartCount > 0" class="mobile-badge">{{ cartCount }}</span>
        </router-link>
        <router-link to="/orders" class="mobile-link" @click="mobileMenuOpen = false" active-class="mobile-active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Orders
        </router-link>
        <router-link to="/profile" class="mobile-link" @click="mobileMenuOpen = false" active-class="mobile-active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Profile
        </router-link>
        <hr class="dropdown-divider" />
        <button class="mobile-link mobile-logout" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </template>
      <template v-else>
        <router-link to="/login" class="mobile-link" @click="mobileMenuOpen = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          Login
        </router-link>
        <router-link to="/register" class="mobile-link" @click="mobileMenuOpen = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Register
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import api from '../api/axios'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const mobileMenuOpen = ref(false)
const cartCount = ref(0)

async function loadCartCount() {
  if (!auth.isLoggedIn) return
  try {
    const response = await api.get('/cart')
    cartCount.value = response.data.cart_items.length
  } catch (e) {
    // ignore
  }
}

function searchProducts() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Products', query: { search: searchQuery.value.trim() } })
    searchQuery.value = ''
    mobileMenuOpen.value = false
  }
}

function searchProductsMobile() {
  if (mobileSearchQuery.value.trim()) {
    router.push({ name: 'Products', query: { search: mobileSearchQuery.value.trim() } })
    mobileSearchQuery.value = ''
    mobileMenuOpen.value = false
  }
}

async function handleLogout() {
  await auth.logout()
  toast.info('You have been logged out successfully.')
  cartCount.value = 0
  router.push('/')
  mobileMenuOpen.value = false
}

watch(() => auth.isLoggedIn, (newVal) => {
  if (newVal) loadCartCount()
})

// Close mobile menu on route change
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

// Close mobile menu on window resize
watch(mobileMenuOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Listen for cart-updated events from other components (e.g., quick add)
onMounted(() => {
  loadCartCount()
  window.addEventListener('cart-updated', loadCartCount)
})

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('cart-updated', loadCartCount)
})
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--gray-100);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  transition: transform var(--transition-fast);
}

.navbar-brand:hover {
  transform: scale(1.02);
}

.brand-icon {
  font-size: 28px;
}

.navbar-search {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 400px;
  margin: 0 24px;
}

.navbar-search input {
  flex: 1;
  padding: 9px 14px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius) 0 0 var(--radius);
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.navbar-search input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-btn {
  padding: 9px 14px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--white);
  border: none;
  border-radius: 0 var(--radius) var(--radius) 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.3s;
}

.search-btn:hover {
  background: var(--primary-darker);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  color: var(--gray-600);
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link:hover {
  color: var(--primary);
  background: var(--primary-lighter);
}

.nav-link.active-link {
  color: var(--primary);
  background: var(--primary-lighter);
  font-weight: 600;
}

.icon-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -2px;
  background: linear-gradient(135deg, var(--danger) 0%, var(--danger-dark) 100%);
  color: var(--white);
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  padding: 0 4px;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  color: var(--gray-600);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--radius);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-toggle:hover {
  color: var(--primary);
  background: var(--primary-lighter);
}

.user-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow-xl);
  min-width: 200px;
  padding: 8px 0;
  display: none;
  margin-top: 8px;
  border: 1px solid var(--gray-100);
  animation: dropdownFade 0.2s ease;
  z-index: 100;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: var(--gray-700);
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--gray-50);
  color: var(--primary);
}

.logout-item {
  color: var(--danger);
}

.logout-item:hover {
  background: var(--danger-light);
  color: var(--danger-dark);
}

.dropdown-divider {
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: 4px 0;
}

/* Mobile Search Bar */
.mobile-search-bar {
  display: none;
  padding: 0 20px 12px;
  gap: 0;
}

.mobile-search-bar input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius) 0 0 var(--radius);
  font-size: 14px;
  outline: none;
}

.mobile-search-bar input:focus {
  border-color: var(--primary);
}

.mobile-search-bar .search-btn {
  padding: 10px 14px;
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--gray-700);
  padding: 8px;
  border-radius: var(--radius);
  transition: background 0.2s;
}

.mobile-toggle:hover {
  background: var(--gray-100);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  background: var(--white);
  border-top: 1px solid var(--gray-200);
  padding: 8px 0;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  animation: slideDown 0.25s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: calc(100vh - 70px);
  }
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: var(--gray-700);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-left: 3px solid transparent;
}

.mobile-link:hover {
  background: var(--gray-50);
  color: var(--primary);
}

.mobile-link.mobile-active {
  color: var(--primary);
  background: var(--primary-lighter);
  border-left-color: var(--primary);
  font-weight: 600;
}

.mobile-logout {
  color: var(--danger);
}

.mobile-badge {
  margin-left: auto;
  background: linear-gradient(135deg, var(--danger) 0%, var(--danger-dark) 100%);
  color: white;
  font-size: 11px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  padding: 0 6px;
}

@media (max-width: 768px) {
  .navbar-search {
    display: none;
  }

  .mobile-search-bar {
    display: flex;
  }

  .navbar-links {
    display: none;
  }

  .mobile-toggle {
    display: block;
  }

  .mobile-menu {
    display: block;
  }
}
</style>