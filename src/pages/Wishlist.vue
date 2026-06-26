<template>
  <div class="page-content">
    <div class="container">
      <div class="page-header">
        <h1>My Wishlist</h1>
        <p>Products you've saved for later</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="wishlists.length === 0" class="empty-state">
        <div class="empty-state-icon">💔</div>
        <h3>Your wishlist is empty</h3>
        <p>Save products you love to your wishlist</p>
        <router-link to="/products" class="btn btn-primary">Browse Products</router-link>
      </div>

      <div v-else class="grid grid-4">
        <div v-for="item in wishlists" :key="item.id" class="wishlist-item card">
          <router-link :to="`/products/${item.product.id}`">
            <div class="product-image">
              <img :src="getProductImage(item.product)" :alt="item.product.name" />
            </div>
          </router-link>
          <div class="card-body">
            <span class="product-category">{{ item.product.category?.name }}</span>
            <router-link :to="`/products/${item.product.id}`">
              <h3 class="product-name">{{ item.product.name }}</h3>
            </router-link>
            <div class="product-price">
              <span v-if="item.product.sale_price" class="sale-price">${{ item.product.sale_price }}</span>
              <span :class="{ original: item.product.sale_price }">${{ item.product.price }}</span>
            </div>
            <div class="wishlist-actions">
              <button class="btn btn-primary btn-sm btn-block" @click="addToCart(item.product)">
                🛒 Add to Cart
              </button>
              <button class="btn btn-danger btn-sm btn-block" @click="removeFromWishlist(item)">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

const wishlists = ref([])
const loading = ref(true)

function getProductImage(product) {
  if (product.image) return `http://localhost:8000/storage/${product.image}`
  if (product.images && product.images.length > 0) return `http://localhost:8000/storage/${product.images[0]}`
  return '/placeholder-product.svg'
}

async function loadWishlist() {
  try {
    const response = await api.get('/wishlists')
    wishlists.value = response.data.wishlists
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function addToCart(product) {
  try {
    await api.post('/cart', { product_id: product.id, quantity: 1 })
    alert('Product added to cart!')
  } catch (e) {
    alert(e.response?.data?.message || 'Failed to add to cart')
  }
}

async function removeFromWishlist(item) {
  try {
    await api.delete(`/wishlists/${item.product.id}`)
    wishlists.value = wishlists.value.filter(w => w.id !== item.id)
  } catch (e) {
    alert(e.response?.data?.message || 'Failed to remove from wishlist')
  }
}

onMounted(loadWishlist)
</script>

<style scoped>
.product-image {
  height: 200px;
  overflow: hidden;
  background: var(--gray-50);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-category {
  font-size: 12px;
  color: var(--primary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-name {
  font-size: 14px;
  color: var(--gray-800);
  margin: 6px 0;
  font-weight: 600;
  line-height: 1.4;
}

.product-price {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
}

.product-price .original {
  color: var(--gray-400);
  text-decoration: line-through;
  font-weight: 400;
  font-size: 14px;
  margin-left: 6px;
}

.sale-price {
  color: var(--danger);
  margin-right: 6px;
}

.wishlist-actions {
  display: flex;
  gap: 8px;
}

.wishlist-actions .btn {
  font-size: 12px;
}
</style>