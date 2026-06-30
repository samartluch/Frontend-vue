<template>
  <div class="page-content">
    <div class="container">
      <div class="page-header">
        <h1>Products</h1>
        <p>Browse our collection of high-quality products</p>
      </div>

      <div class="products-layout">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar card">
          <div class="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            Filters
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select v-model="filters.category_id" class="form-select" @change="applyFilters">
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Price Range</label>
              <div class="price-range">
                <input type="number" v-model.number="filters.min_price" class="form-input" placeholder="Min" @change="applyFilters" />
                <span class="range-sep">—</span>
                <input type="number" v-model.number="filters.max_price" class="form-input" placeholder="Max" @change="applyFilters" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Sort By</label>
              <select v-model="filters.sort" class="form-select" @change="applyFilters">
<option value="-created_at">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            <button class="btn btn-secondary btn-block" @click="clearFilters">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
              Clear Filters
            </button>
          </div>
        </aside>

        <!-- Products Grid -->
        <div class="products-content">
          <div class="products-header">
            <p v-if="!loading" class="results-count">
              <strong>{{ products.total }}</strong> product{{ products.total !== 1 ? 's' : '' }} found
            </p>
            <div v-if="route.query.search" class="search-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <strong>Search:</strong> "{{ route.query.search }}"
              <button class="clear-search" @click="clearSearch">✕</button>
            </div>
          </div>

          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
          </div>

          <div v-else-if="products.data?.length === 0" class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button class="btn btn-primary" @click="clearFilters">View All Products</button>
          </div>

          <div v-else class="grid grid-3">
            <div v-for="product in products.data" :key="product.id" class="product-card card" @click="goToProduct(product)">
              <div class="product-image">
                <img :src="getProductImage(product)" :alt="product.name" loading="lazy" />
                <div v-if="product.sale_price" class="product-badge pulse">SALE</div>
                <div class="quick-view-overlay">
                  <span>Quick View</span>
                </div>
              </div>
              <div class="card-body">
                <span class="product-category">{{ product.category?.name }}</span>
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-price-row">
                  <div class="product-price">
                    <span v-if="product.sale_price" class="sale-price">${{ product.sale_price }}</span>
                    <span :class="{ original: product.sale_price }">${{ product.price }}</span>
                  </div>
                  <button class="add-mini-btn" @click.stop="quickAdd(product)" title="Quick add to cart">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="products.last_page > 1" class="pagination">
            <button
              class="btn btn-secondary btn-sm"
              :disabled="products.current_page === 1"
              @click="changePage(products.current_page - 1)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Previous
            </button>
            <div class="page-numbers">
              <button
                v-for="page in products.last_page"
                :key="page"
                class="page-btn"
                :class="{ active: page === products.current_page }"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>
            <button
              class="btn btn-secondary btn-sm"
              :disabled="products.current_page === products.last_page"
              @click="changePage(products.current_page + 1)"
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const route = useRoute()
const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const categories = ref([])
const products = ref({ data: [], current_page: 1, last_page: 1, total: 0 })
const loading = ref(true)

const filters = reactive({
  category_id: route.query.category_id || '',
  search: route.query.search || '',
  min_price: route.query.min_price || '',
  max_price: route.query.max_price || '',
  sort: route.query.sort || '-created_at',
  page: route.query.page || 1,
})

function getProductImage(product) {
  if (product.image) return `http://localhost:8000/storage/${product.image}`
  if (product.images && product.images.length > 0) return `http://localhost:8000/storage/${product.images[0]}`
  return '/placeholder-product.svg'
}

function goToProduct(product) {
  router.push({ name: 'ProductDetail', params: { id: product.id } })
}

async function quickAdd(product) {
  if (!auth.isLoggedIn) {
    router.push({ name: 'Login', query: { redirect: '/products' } })
    return
  }
  try {
    await api.post('/cart', { product_id: product.id, quantity: 1 })
    toast.success(`${product.name} added to cart!`)
    // Dispatch event so Navbar can update cart count
    window.dispatchEvent(new CustomEvent('cart-updated'))
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to add to cart')
  }
}

async function loadCategories() {
  try {
    const response = await api.get('/categories')
    categories.value = response.data.categories
  } catch (e) {
    console.error(e)
  }
}

async function loadProducts() {
  loading.value = true
  try {
    const params = {}
    if (filters.category_id) params.category_id = filters.category_id
    if (filters.search) params.search = filters.search
    if (filters.min_price) params.min_price = filters.min_price
    if (filters.max_price) params.max_price = filters.max_price
    if (filters.sort) {
            if (filters.sort.startsWith('-')) {
                params.sort = filters.sort.substring(1)
                params.order = 'desc'
            } else {
                params.sort = filters.sort
                params.order = 'asc'
            }
    }
    params.page = filters.page

    const response = await api.get('/products', { params })
    products.value = response.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  filters.page = 1
  loadProducts()
}

function clearFilters() {
  filters.category_id = ''
  filters.search = ''
  filters.min_price = ''
  filters.max_price = ''
  filters.sort = '-created_at'
  filters.page = 1
  router.push({ name: 'Products' })
  loadProducts()
}

function clearSearch() {
  filters.search = ''
  router.push({ name: 'Products' })
  loadProducts()
}

function changePage(page) {
  filters.page = page
  loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for search query changes from navbar
watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    filters.search = newSearch
    loadProducts()
  }
})

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped>
.products-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  padding-top: 20px;
}

.filters-sidebar {
  height: fit-content;
  position: sticky;
  top: 90px;
}

.filters-sidebar .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-range input {
  width: 100%;
}

.range-sep {
  color: var(--gray-400);
  font-size: 14px;
}

.products-content {
  min-height: 400px;
}

.products-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.results-count {
  color: var(--gray-500);
  font-size: 14px;
}

.results-count strong {
  color: var(--gray-800);
}

.search-info {
  background: var(--gray-100);
  padding: 6px 12px;
  border-radius: var(--radius);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-search {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--gray-500);
  padding: 2px;
  transition: color 0.2s;
}

.clear-search:hover {
  color: var(--danger);
}

/* Product Card - Enhanced */
.product-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--gray-100);
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-light);
}

.product-image {
  height: 220px;
  overflow: hidden;
  position: relative;
  background: var(--gray-50);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, var(--danger) 0%, var(--danger-dark) 100%);
  color: var(--white);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  z-index: 2;
}

.quick-view-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .quick-view-overlay {
  opacity: 1;
}

.quick-view-overlay span {
  color: white;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 20px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.3);
  transform: translateY(10px);
  transition: transform 0.3s;
}

.product-card:hover .quick-view-overlay span {
  transform: translateY(0);
}

.product-category {
  font-size: 11px;
  color: var(--primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  background: var(--primary-lighter);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.product-name {
  font-size: 15px;
  color: var(--gray-800);
  margin: 8px 0;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}

.product-card:hover .product-name {
  color: var(--primary);
}

.product-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.product-price {
  font-size: 17px;
  font-weight: 700;
  color: var(--primary);
}

.product-price .original {
  color: var(--gray-400);
  text-decoration: line-through;
  font-weight: 400;
  font-size: 13px;
  margin-left: 6px;
}

.sale-price {
  color: var(--danger);
  margin-right: 6px;
}

.add-mini-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--gray-200);
  background: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  transition: all 0.2s;
}

.add-mini-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  width: 38px;
  height: 38px;
  border: 1px solid var(--gray-200);
  background: var(--white);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  font-weight: 500;
}

.page-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-lighter);
  transform: translateY(-2px);
}

.page-btn.active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--white);
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

@media (max-width: 768px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
  }
  
  .product-image {
    height: 180px;
  }
}
</style>