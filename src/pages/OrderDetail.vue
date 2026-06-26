<template>
  <div class="page-content">
    <div class="container">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <template v-else-if="order">
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <span>→</span>
          <router-link to="/orders">Orders</router-link>
          <span>→</span>
          <span class="current">{{ order.order_number }}</span>
        </div>

        <div class="page-header">
          <h1>Order {{ order.order_number }}</h1>
          <p>Placed on {{ formatDate(order.created_at) }}</p>
        </div>

        <div class="order-detail-layout">
          <div class="order-main">
            <!-- Status -->
            <div class="card status-card">
              <div class="card-body">
                <span class="status-label">Status</span>
                <span :class="['badge', 'badge-lg', getStatusBadge(order.status)]">
                  {{ order.status }}
                </span>
              </div>
            </div>

            <!-- Items -->
            <div class="card">
              <div class="card-header">Order Items</div>
              <div class="card-body">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <div class="order-item-image">
                    <img :src="getItemImage(item)" :alt="item.product_name" />
                  </div>
                  <div class="order-item-details">
                    <h4>{{ item.product_name }}</h4>
                    <p>Qty: {{ item.quantity }} × ${{ item.price }}</p>
                  </div>
                  <div class="order-item-total">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="card">
              <div class="card-header">Order Timeline</div>
              <div class="card-body">
                <div class="timeline">
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div>
                      <p class="timeline-title">Order Placed</p>
                      <p class="timeline-date">{{ formatDate(order.created_at) }}</p>
                    </div>
                  </div>
                  <div v-if="order.status !== 'pending'" class="timeline-item">
                    <div class="timeline-dot processing"></div>
                    <div>
                      <p class="timeline-title">Processing</p>
                    </div>
                  </div>
                  <div v-if="order.status === 'completed'" class="timeline-item">
                    <div class="timeline-dot completed"></div>
                    <div>
                      <p class="timeline-title">Completed</p>
                    </div>
                  </div>
                  <div v-if="order.status === 'cancelled'" class="timeline-item">
                    <div class="timeline-dot cancelled"></div>
                    <div>
                      <p class="timeline-title">Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="order-sidebar">
            <div class="card">
              <div class="card-header">Order Summary</div>
              <div class="card-body">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>${{ order.subtotal }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row total">
                  <span>Total</span>
                  <span>${{ order.total }}</span>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">Shipping Details</div>
              <div class="card-body">
                <div class="detail-row">
                  <span class="detail-label">Name</span>
                  <span class="detail-value">{{ order.shipping_name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">{{ order.shipping_phone }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">{{ order.shipping_address }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment</span>
                  <span class="detail-value">{{ order.payment_method }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'

const route = useRoute()
const order = ref(null)
const loading = ref(true)

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

function getItemImage(item) {
  if (item.product?.image) return `http://localhost:8000/storage/${item.product.image}`
  return '/placeholder-product.svg'
}

async function loadOrder() {
  try {
    const response = await api.get(`/orders/${route.params.id}`)
    order.value = response.data.order
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadOrder)
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
  font-size: 14px;
  color: var(--gray-500);
}

.breadcrumb a {
  color: var(--gray-500);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--primary);
}

.order-detail-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  padding-top: 20px;
}

.status-card .card-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-label {
  font-size: 14px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.badge-lg {
  font-size: 14px;
  padding: 6px 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--gray-100);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item-image {
  width: 60px;
  height: 60px;
  border-radius: var(--radius);
  overflow: hidden;
  flex-shrink: 0;
}

.order-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-item-details {
  flex: 1;
}

.order-item-details h4 {
  font-size: 14px;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.order-item-details p {
  font-size: 13px;
  color: var(--gray-500);
}

.order-item-total {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-800);
}

/* Timeline */
.timeline-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  position: relative;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 24px;
  bottom: 0;
  width: 2px;
  background: var(--gray-200);
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--gray-300);
  flex-shrink: 0;
  margin-top: 2px;
}

.timeline-dot.processing {
  background: var(--primary);
}

.timeline-dot.completed {
  background: var(--success);
}

.timeline-dot.cancelled {
  background: var(--danger);
}

.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
}

.timeline-date {
  font-size: 12px;
  color: var(--gray-500);
}

/* Summary */
.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: var(--gray-600);
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-900);
}

.summary-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 8px 0;
}

.detail-row {
  padding: 8px 0;
  border-bottom: 1px solid var(--gray-100);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  display: block;
  font-size: 12px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 14px;
  color: var(--gray-800);
}

.order-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 768px) {
  .order-detail-layout {
    grid-template-columns: 1fr;
  }
}
</style>