<template>
  <div class="page-content">
    <div class="container">
      <div class="page-header">
        <h1>My Orders</h1>
        <p>View your order history</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-state-icon">📦</div>
        <h3>No orders yet</h3>
        <p>You haven't placed any orders yet</p>
        <router-link to="/products" class="btn btn-primary">Start Shopping</router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card card" @click="$router.push(`/orders/${order.id}`)">
          <div class="order-header">
            <div>
              <span class="order-number">{{ order.order_number }}</span>
              <span class="order-date">{{ formatDate(order.created_at) }}</span>
            </div>
            <span :class="['badge', getStatusBadge(order.status)]">{{ order.status }}</span>
          </div>
          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <span>{{ item.product_name }} × {{ item.quantity }}</span>
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          <div class="order-footer">
            <span class="order-total">Total: <strong>${{ order.total }}</strong></span>
            <span class="view-details">View Details →</span>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="pagination">
          <button
            class="btn btn-secondary btn-sm"
            :disabled="pagination.current_page === 1"
            @click="changePage(pagination.current_page - 1)"
          >
            ← Previous
          </button>
          <span class="page-info">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
          <button
            class="btn btn-secondary btn-sm"
            :disabled="pagination.current_page === pagination.last_page"
            @click="changePage(pagination.current_page + 1)"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

const orders = ref([])
const loading = ref(true)
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getStatusBadge(status) {
  const badges = {
    pending: 'badge-warning',
    processing: 'badge-primary',
    completed: 'badge-success',
    cancelled: 'badge-danger',
  }
  return badges[status] || 'badge-primary'
}

async function loadOrders(page = 1) {
  loading.value = true
  try {
    const response = await api.get(`/orders?page=${page}`)
    orders.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total,
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function changePage(page) {
  loadOrders(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => loadOrders())
</script>

<style scoped>
.order-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.order-card:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-100);
  background: var(--gray-50);
}

.order-number {
  font-weight: 700;
  color: var(--gray-800);
  font-size: 14px;
}

.order-date {
  color: var(--gray-500);
  font-size: 13px;
  margin-left: 12px;
}

.order-items {
  padding: 16px 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: var(--gray-600);
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid var(--gray-100);
}

.order-total {
  font-size: 14px;
  color: var(--gray-600);
}

.order-total strong {
  color: var(--primary);
  font-size: 16px;
}

.view-details {
  font-size: 14px;
  color: var(--primary);
  font-weight: 600;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.page-info {
  color: var(--gray-500);
  font-size: 14px;
}
</style>