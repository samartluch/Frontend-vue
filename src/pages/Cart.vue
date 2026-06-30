<template>
  <div class="page-content">
    <div class="container">
      <div class="page-header">
        <h1>Shopping Cart</h1>
        <p>{{ cartItems.length }} item(s) in your cart</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <template v-else-if="cartItems.length === 0">
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Start shopping and add items to your cart</p>
          <router-link to="/products" class="btn btn-primary btn-lg pulse-glow">Browse Products</router-link>
        </div>
      </template>

      <div v-else class="cart-layout">
        <!-- Cart Items -->
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item card fade-in">
            <div class="cart-item-image">
              <router-link :to="`/products/${item.product.id}`">
                <img :src="getProductImage(item.product)" :alt="item.product.name" />
              </router-link>
            </div>
            <div class="cart-item-details">
              <router-link :to="`/products/${item.product.id}`">
                <h3>{{ item.product.name }}</h3>
              </router-link>
              <p class="item-category">{{ item.product.category?.name }}</p>
              <p class="item-price">
                ${{ item.product.sale_price || item.product.price }}
                <span v-if="item.product.sale_price" class="original">${{ item.product.price }}</span>
              </p>
            </div>
            <div class="cart-item-quantity">
              <div class="quantity-control">
                <button class="qty-btn" @click="updateQuantity(item, -1)" title="Decrease quantity">−</button>
                <input type="number" :value="item.quantity" min="1" class="qty-input" readonly />
                <button class="qty-btn" @click="updateQuantity(item, 1)" title="Increase quantity">+</button>
              </div>
            </div>
            <div class="cart-item-total">
              <p class="item-subtotal">${{ getItemTotal(item) }}</p>
            </div>
            <div class="cart-item-remove">
              <button class="remove-btn" @click="removeItem(item)" title="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>

          <!-- Coupon Code -->
          <div class="coupon-section card">
            <div class="card-body">
              <div class="coupon-form">
                <input
                  v-model="couponCode"
                  type="text"
                  placeholder="Enter coupon code"
                  class="form-input"
                />
                <button class="btn btn-primary" @click="applyCoupon" :disabled="!couponCode.trim()">
                  Apply
                </button>
              </div>
              <p v-if="couponApplied" class="coupon-success">✅ Coupon applied successfully! You saved 10%</p>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary card">
          <div class="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Order Summary
          </div>
          <div class="card-body">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span class="shipping-cost">
                <span v-if="subtotal >= 50" class="free-shipping">FREE</span>
                <span v-else>$5.00</span>
              </span>
            </div>
            <div v-if="couponApplied" class="summary-row discount">
              <span>Discount (10%)</span>
              <span>-${{ (subtotal * 0.1).toFixed(2) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total</span>
              <span>${{ grandTotal.toFixed(2) }}</span>
            </div>
            <router-link to="/checkout" class="btn btn-primary btn-block btn-lg checkout-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Proceed to Checkout
            </router-link>
            <router-link to="/products" class="btn btn-outline btn-block continue-shopping">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const cartItems = ref([])
const loading = ref(true)
const couponCode = ref('')
const couponApplied = ref(false)

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = item.product?.sale_price || item.product?.price || 0
    return sum + price * item.quantity
  }, 0)
})

const grandTotal = computed(() => {
  const shipping = subtotal.value >= 50 ? 0 : 5
  const discount = couponApplied.value ? subtotal.value * 0.1 : 0
  return subtotal.value + shipping - discount
})

function getProductImage(product) {
  if (!product) return '/placeholder-product.svg'
  if (product.image) return `http://localhost:8000/storage/${product.image}`
  if (product.images && product.images.length > 0) return `http://localhost:8000/storage/${product.images[0]}`
  return '/placeholder-product.svg'
}

function getItemTotal(item) {
  const price = item.product?.sale_price || item.product?.price || 0
  return (price * item.quantity).toFixed(2)
}

function applyCoupon() {
  if (couponCode.value.trim().toLowerCase() === 'save10') {
    couponApplied.value = true
    toast.success('Coupon applied! You saved 10%')
  } else {
    toast.error('Invalid coupon code')
  }
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

async function updateQuantity(item, delta) {
  const newQty = item.quantity + delta
  if (newQty < 1) return
  try {
    await api.put(`/cart/${item.id}`, { quantity: newQty })
    item.quantity = newQty
    window.dispatchEvent(new CustomEvent('cart-updated'))
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to update quantity')
  }
}

async function removeItem(item) {
  try {
    await api.delete(`/cart/${item.id}`)
    cartItems.value = cartItems.value.filter(i => i.id !== item.id)
    toast.info('Item removed from cart')
    window.dispatchEvent(new CustomEvent('cart-updated'))
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to remove item')
  }
}

onMounted(() => {
  if (!auth.isLoggedIn) {
    router.push({ name: 'Login', query: { redirect: '/cart' } })
    return
  }
  loadCart()
})
</script>

<style scoped>
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  padding-top: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  margin-bottom: 12px;
  transition: all 0.3s;
  border: 1px solid var(--gray-100);
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.cart-item-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--gray-50);
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.cart-item-image:hover img {
  transform: scale(1.05);
}

.cart-item-details {
  flex: 1;
}

.cart-item-details h3 {
  font-size: 16px;
  color: var(--gray-800);
  margin-bottom: 4px;
  transition: color 0.2s;
}

.cart-item-details h3:hover {
  color: var(--primary);
}

.item-category {
  font-size: 13px;
  color: var(--gray-500);
  margin-bottom: 4px;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
}

.item-price .original {
  font-size: 13px;
  color: var(--gray-400);
  text-decoration: line-through;
  font-weight: 400;
  margin-left: 6px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius);
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--gray-50);
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-700);
}

.qty-btn:hover {
  background: var(--gray-200);
}

.qty-input {
  width: 44px;
  height: 36px;
  border: none;
  border-left: 1px solid var(--gray-300);
  border-right: 1px solid var(--gray-300);
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
  appearance: textfield;
  -moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.item-subtotal {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
}

.remove-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--gray-200);
  background: var(--white);
  border-radius: var(--radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
  transition: all 0.2s;
}

.remove-btn:hover {
  background: var(--danger-light);
  border-color: var(--danger);
  color: var(--danger);
  transform: scale(1.1);
}

/* Coupon */
.coupon-section {
  margin-top: 0;
}

.coupon-form {
  display: flex;
  gap: 8px;
}

.coupon-form .form-input {
  flex: 1;
}

.coupon-success {
  color: var(--success);
  font-size: 13px;
  margin-top: 8px;
  font-weight: 500;
}

/* Cart Summary */
.cart-summary {
  height: fit-content;
  position: sticky;
  top: 90px;
  border: 1px solid var(--gray-100);
}

.cart-summary .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: var(--gray-600);
}

.summary-row.discount {
  color: var(--success);
}

.shipping-cost {
  font-weight: 600;
}

.free-shipping {
  color: var(--success);
  font-weight: 700;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-900);
  padding: 12px 0;
}

.summary-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 4px 0;
}

.checkout-btn {
  margin-top: 16px;
}

.continue-shopping {
  margin-top: 8px;
}

.pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 20px 8px rgba(99, 102, 241, 0.1); }
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 12px;
  }

  .cart-item-image {
    width: 80px;
    height: 80px;
  }

  .cart-item-remove {
    margin-left: auto;
  }
}
</style>