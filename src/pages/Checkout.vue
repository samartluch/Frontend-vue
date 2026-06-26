<template>
  <div class="page-content">
    <div class="container">
      <div class="page-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <template v-else-if="cartItems.length === 0">
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <router-link to="/products" class="btn btn-primary">Browse Products</router-link>
        </div>
      </template>

      <div v-else class="checkout-layout">
        <!-- Shipping Form -->
        <div class="checkout-form card">
          <div class="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            Shipping Information
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              {{ error }}
            </div>

            <form @submit.prevent="placeOrder">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input v-model="form.shipping_name" type="text" class="form-input" required placeholder="John Doe" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Phone</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <input v-model="form.shipping_phone" type="text" class="form-input" required placeholder="+1 234 567 890" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Shipping Address</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <textarea v-model="form.shipping_address" class="form-textarea" required placeholder="Enter your full address"></textarea>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Payment Method</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  <select v-model="form.payment_method" class="form-select" required>
                    <option value="">Select payment method</option>
                    <option value="credit_card">💳 Credit Card</option>
                    <option value="bank_transfer">🏦 Bank Transfer</option>
                    <option value="cash_on_delivery">💵 Cash on Delivery</option>
                    <option value="paypal">📱 PayPal</option>
                  </select>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="submitting">
                <span v-if="submitting" class="btn-spinner"></span>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {{ submitting ? 'Processing...' : 'Place Order' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary card">
          <div class="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Order Summary
          </div>
          <div class="card-body">
            <div v-for="item in cartItems" :key="item.id" class="summary-item">
              <div class="summary-item-image">
                <img :src="getProductImage(item.product)" :alt="item.product.name" />
              </div>
              <div class="summary-item-details">
                <p class="summary-item-name">{{ item.product.name }}</p>
                <p class="summary-item-qty">Qty: {{ item.quantity }}</p>
              </div>
              <p class="summary-item-price">
                ${{ ((item.product.sale_price || item.product.price) * item.quantity).toFixed(2) }}
              </p>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span class="shipping-badge">{{ subtotal >= 50 ? 'FREE' : '$5.00' }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total</span>
              <span>${{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const cartItems = ref([])
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const form = reactive({
  shipping_name: auth.currentUser?.name || '',
  shipping_phone: auth.currentUser?.phone || '',
  shipping_address: auth.currentUser?.address || '',
  payment_method: '',
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = item.product?.sale_price || item.product?.price || 0
    return sum + price * item.quantity
  }, 0)
})

const grandTotal = computed(() => {
  const shipping = subtotal.value >= 50 ? 0 : 5
  return subtotal.value + shipping
})

function getProductImage(product) {
  if (!product) return '/placeholder-product.svg'
  if (product.image) return `http://localhost:8000/storage/${product.image}`
  if (product.images?.length > 0) return `http://localhost:8000/storage/${product.images[0]}`
  return '/placeholder-product.svg'
}

async function loadCart() {
  try {
    const response = await api.get('/cart')
    cartItems.value = response.data.cart_items
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function placeOrder() {
  if (!form.payment_method) {
    toast.error('Please select a payment method')
    return
  }
  submitting.value = true
  error.value = ''
  try {
    await api.post('/checkout', {
      shipping_name: form.shipping_name,
      shipping_phone: form.shipping_phone,
      shipping_address: form.shipping_address,
      payment_method: form.payment_method,
    })
    toast.success('Order placed successfully!')
    router.push('/orders')
  } catch (e) {
    error.value = e.response?.data?.message || 'Checkout failed. Please try again.'
    toast.error(error.value)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (!auth.isLoggedIn) {
    router.push({ name: 'Login', query: { redirect: '/checkout' } })
    return
  }
  loadCart()
})
</script>

<style scoped>
.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  padding-top: 20px;
}

.checkout-form {
  max-width: 600px;
}

.checkout-form .card-header,
.order-summary .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Input icons */
.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: flex-start;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 12px;
  color: var(--gray-400);
  pointer-events: none;
}

.input-icon-wrapper .form-input,
.input-icon-wrapper .form-textarea,
.input-icon-wrapper .form-select {
  padding-left: 40px;
  width: 100%;
}

.input-icon-wrapper .form-textarea {
  min-height: 80px;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--gray-100);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item-image {
  width: 50px;
  height: 50px;
  border-radius: var(--radius);
  overflow: hidden;
  flex-shrink: 0;
}

.summary-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-item-details {
  flex: 1;
}

.summary-item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
}

.summary-item-qty {
  font-size: 12px;
  color: var(--gray-500);
}

.summary-item-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: var(--gray-600);
}

.shipping-badge {
  font-weight: 600;
  color: var(--success);
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-900);
}

.summary-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 12px 0;
}

.order-summary {
  height: fit-content;
  position: sticky;
  top: 90px;
}

@media (max-width: 768px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>