<template>
  <div class="page-content">
    <div class="container">
      <!-- Loading / Error / Content with transition -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="loading" key="loading" class="loading-skeleton">
          <div class="skeleton-breadcrumb"></div>
          <div class="skeleton-detail">
            <div class="skeleton-image"></div>
            <div class="skeleton-info">
              <div class="skeleton-line short"></div>
              <div class="skeleton-line medium"></div>
              <div class="skeleton-line long"></div>
              <div class="skeleton-line medium"></div>
              <div class="skeleton-line full"></div>
              <div class="skeleton-line full"></div>
              <div class="skeleton-actions">
                <div class="skeleton-btn"></div>
                <div class="skeleton-btn"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="error" key="error" class="error-state">
          <div class="error-icon">⚠</div>
          <h2>Failed to Load Product</h2>
          <p>{{ error }}</p>
          <div class="error-actions">
            <button class="btn btn-primary" @click="retryLoad">Try Again</button>
            <router-link to="/products" class="btn btn-outline">Back to Products</router-link>
          </div>
        </div>

        <div v-else key="product" class="product-wrapper">
          <div class="breadcrumb">
            <router-link to="/">Home</router-link>
            <span class="breadcrumb-sep">›</span>
            <router-link to="/products">Products</router-link>
            <span class="breadcrumb-sep">›</span>
            <span class="current">{{ product.name }}</span>
          </div>

          <div class="product-detail">
            <!-- Product Gallery -->
            <div class="product-gallery">
              <div class="main-image" @click="openLightbox">
                <transition name="fade" mode="out-in">
                  <img :key="currentImage" :src="currentImage" :alt="product.name" />
                </transition>
                <div v-if="product.sale_price" class="sale-badge">SALE</div>
                <button class="zoom-btn" title="Click to zoom">🔍</button>
              </div>

              <div v-if="allImages.length > 1" class="image-thumbnails">
                <img
                  v-for="(img, index) in allImages"
                  :key="index"
                  :src="img"
                  :class="{ active: selectedImage === index }"
                  @click="selectedImage = index"
                />
              </div>
            </div>

            <!-- Product Info -->
            <div class="product-info">
              <span class="product-category">{{ product.category?.name }}</span>
              <h1 class="product-title">{{ product.name }}</h1>

              <div class="product-rating">
                <span class="stars">
                  <span v-for="n in 5" :key="n" :class="{ filled: n <= avgRating }">
                    {{ n <= avgRating ? '★' : '☆' }}
                  </span>
                </span>
                <span class="rating-count">({{ product.reviews_count || 0 }} {{ product.reviews_count === 1 ? 'review' : 'reviews' }})</span>
              </div>

              <div class="product-price-section">
                <span class="current-price">${{ formattedPrice }}</span>
                <span v-if="product.sale_price" class="original-price">${{ product.price }}</span>
                <span v-if="product.sale_price" class="discount-badge">-{{ discountPercent }}% OFF</span>
              </div>

              <p class="product-description">{{ product.description }}</p>

              <!-- Stock indicator -->
              <div class="stock-section">
                <div class="stock-status">
                  <span v-if="product.stock > 0" class="stock-dot in-stock"></span>
                  <span v-else class="stock-dot out-of-stock"></span>
                  <span :class="stockClass">{{ stockText }}</span>
                </div>
                <div v-if="product.stock > 0" class="stock-bar">
                  <div class="stock-fill" :style="{ width: stockPercent + '%' }"></div>
                </div>
              </div>

              <div class="product-actions">
                <div class="quantity-control">
                  <button class="qty-btn" @click="decrementQty" :disabled="quantity <= 1">−</button>
                  <input
                    type="number"
                    v-model.number="quantity"
                    min="1"
                    :max="product.stock"
                    class="qty-input"
                    @keydown.prevent
                  />
                  <button class="qty-btn" @click="incrementQty" :disabled="quantity >= product.stock">+</button>
                </div>

                <button
                  class="btn btn-primary btn-lg add-to-cart-btn"
                  :disabled="product.stock === 0 || addingToCart"
                  @click="addToCart"
                >
                  <span v-if="addingToCart" class="btn-spinner"></span>
                  <span v-else>🛒</span>
                  {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
                </button>

                <button
                  class="btn wishlist-btn"
                  :class="{ active: isWishlisted }"
                  @click="toggleWishlist"
                  :title="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
                >
                  <transition name="heart" mode="out-in">
                    <span :key="isWishlisted ? 'filled' : 'empty'">{{ isWishlisted ? '❤️' : '🤍' }}</span>
                  </transition>
                </button>
              </div>

              <div class="product-meta-grid">
                <div class="meta-item">
                  <span class="meta-icon">📂</span>
                  <div class="meta-content">
                    <span class="meta-label">Category</span>
                    <span class="meta-value">{{ product.category?.name }}</span>
                  </div>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">🏷️</span>
                  <div class="meta-content">
                    <span class="meta-label">SKU</span>
                    <span class="meta-value">{{ product.slug || 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Products (loaded from consolidated API response) -->
          <div v-if="relatedProducts.length > 0" class="related-section">
            <h2 class="section-title">You May Also Like</h2>
            <div class="related-grid">
              <div
                v-for="item in relatedProducts"
                :key="item.id"
                class="related-card"
                @click="$router.push(`/products/${item.id}`)"
              >
                <div class="related-image">
                  <img :src="getProductImage(item)" :alt="item.name" loading="lazy" />
                  <div v-if="item.sale_price" class="related-sale">Sale</div>
                </div>
                <div class="related-info">
                  <h4>{{ item.name }}</h4>
                  <div class="related-price">
                    <span class="current">${{ item.sale_price || item.price }}</span>
                    <span v-if="item.sale_price" class="original">${{ item.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="reviews-section card">
            <div class="card-header">
              <h2>Customer Reviews <span class="review-count">({{ reviews.length }})</span></h2>
              <div v-if="reviews.length > 0" class="rating-summary">
                <div class="rating-stars">
                  <span v-for="n in 5" :key="n" :class="{ filled: n <= Math.round(avgRating) }">★</span>
                </div>
                <span class="rating-avg">{{ avgRating.toFixed(1) }} out of 5</span>
              </div>
            </div>

            <div class="card-body">
              <transition name="fade">
                <div v-if="auth.isLoggedIn" class="add-review">
                  <h3>Write a Review</h3>
                  <div class="star-rating">
                    <span
                      v-for="n in 5"
                      :key="n"
                      class="star-select"
                      :class="{ active: n <= newReview.rating || (n <= hoverRating) }"
                      @click="newReview.rating = n"
                      @mouseenter="hoverRating = n"
                      @mouseleave="hoverRating = 0"
                    >★</span>
                    <span v-if="newReview.rating" class="rating-label">{{ ratingLabels[newReview.rating - 1] }}</span>
                  </div>
                  <textarea
                    v-model="newReview.comment"
                    class="form-textarea"
                    placeholder="Share your experience with this product..."
                    rows="4"
                  ></textarea>
                  <div class="review-form-actions">
                    <button
                      class="btn btn-primary"
                      :disabled="!newReview.rating || submittingReview"
                      @click="submitReview"
                    >
                      <span v-if="submittingReview" class="btn-spinner"></span>
                      {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
                    </button>
                  </div>
                  <transition name="fade">
                    <p v-if="reviewError" class="form-error">{{ reviewError }}</p>
                  </transition>
                </div>
                <div v-else class="login-to-review">
                  <p><router-link to="/login" class="login-link">Login</router-link> to write a review</p>
                </div>
              </transition>

              <div v-if="reviews.length === 0" class="no-reviews">
                <div class="no-reviews-icon">💬</div>
                <p>No reviews yet. Be the first to share your thoughts!</p>
              </div>

              <transition-group name="review-list" tag="div" class="reviews-list">
                <div v-for="review in reviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <div class="review-avatar">{{ review.user?.name?.[0] || 'U' }}</div>
                    <div class="review-user">
                      <strong>{{ review.user?.name || 'Anonymous' }}</strong>
                      <div class="review-stars">
                        <span v-for="n in 5" :key="n" :class="{ filled: n <= review.rating }">★</span>
                      </div>
                    </div>
                    <span class="review-date">{{ formatDate(review.created_at) }}</span>
                  </div>
                  <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
                </div>
              </transition-group>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Image Lightbox -->
    <transition name="lightbox">
      <div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox">✕</button>
          <button class="lightbox-nav prev" @click="prevImage" v-if="allImages.length > 1">‹</button>
          <img :src="allImages[lightboxIndex]" :alt="product?.name" />
          <button class="lightbox-nav next" @click="nextImage" v-if="allImages.length > 1">›</button>
          <div class="lightbox-counter" v-if="allImages.length > 1">
            {{ lightboxIndex + 1 }} / {{ allImages.length }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

// State
const product = ref(null)
const reviews = ref([])
const relatedProducts = ref([])
const loading = ref(true)
const error = ref('')
const quantity = ref(1)
const selectedImage = ref(0)
const addingToCart = ref(false)
const isWishlisted = ref(false)
const submittingReview = ref(false)
const reviewError = ref('')
const hoverRating = ref(0)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
// Cache busting for product detail
let lastProductId = null

const newReview = ref({
  rating: 0,
  comment: '',
})

const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

// Computed
const allImages = computed(() => {
  const images = []
  if (product.value?.image) {
    images.push(`http://localhost:8000/storage/${product.value.image}`)
  }
  if (product.value?.images) {
    product.value.images.forEach(img => {
      images.push(`http://localhost:8000/storage/${img}`)
    })
  }
  return images
})

const currentImage = computed(() => {
  if (allImages.value.length > 0) {
    return allImages.value[selectedImage.value] || allImages.value[0]
  }
  return '/placeholder-product.svg'
})

const formattedPrice = computed(() => {
  const raw = product.value?.sale_price ?? product.value?.price ?? 0
  const price = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(price)) return '0.00'
  return price.toFixed(2)
})

const avgRating = computed(() => {
  return product.value?.reviews_avg_rating || 0
})

const discountPercent = computed(() => {
  if (!product.value?.sale_price) return 0
  return Math.round((1 - product.value.sale_price / product.value.price) * 100)
})

const stockPercent = computed(() => {
  if (!product.value?.stock) return 0
  const max = 100
  const pct = (product.value.stock / max) * 100
  return Math.min(pct, 100)
})

const stockClass = computed(() => {
  if (!product.value?.stock) return 'out-of-stock-text'
  if (product.value.stock <= 5) return 'low-stock'
  if (product.value.stock <= 20) return 'medium-stock'
  return 'in-stock-text'
})

const stockText = computed(() => {
  if (!product.value?.stock) return 'Out of Stock'
  if (product.value.stock <= 5) return `Only ${product.value.stock} left in stock`
  if (product.value.stock <= 20) return `Low stock - ${product.value.stock} available`
  return `${product.value.stock} in stock`
})

// Methods
function getProductImage(item) {
  if (item.image) return `http://localhost:8000/storage/${item.image}`
  if (item.images?.length > 0) return `http://localhost:8000/storage/${item.images[0]}`
  return '/placeholder-product.svg'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function decrementQty() {
  if (quantity.value > 1) quantity.value--
}

function incrementQty() {
  if (quantity.value < product.value.stock) quantity.value++
}

function openLightbox() {
  lightboxIndex.value = selectedImage.value
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function prevImage() {
  lightboxIndex.value = (lightboxIndex.value - 1 + allImages.value.length) % allImages.value.length
}

function nextImage() {
  lightboxIndex.value = (lightboxIndex.value + 1) % allImages.value.length
}

// Consolidated load - single API call for product + related products + reviews
async function loadProduct() {
  const productId = route.params.id
  if (!productId) return
  
  loading.value = true
  error.value = ''
  lastProductId = productId
  
  try {
    const response = await api.get(`/products/${productId}/detail`)
    
    // Prevent stale responses from overwriting newer requests
    if (lastProductId !== route.params.id) return
    
    product.value = response.data.product
    relatedProducts.value = response.data.related_products || []
    // Reviews are loaded from the product's eager-loaded relationship
    reviews.value = product.value.reviews || []
    
    selectedImage.value = 0
    quantity.value = 1
    
    // Check wishlist in background (non-blocking)
    checkWishlist()
    
  } catch (e) {
    if (lastProductId !== route.params.id) return
    error.value = e.response?.data?.message || 'Unable to load product details. Please try again.'
  } finally {
    if (lastProductId === route.params.id) {
      loading.value = false
    }
  }
}

async function checkWishlist() {
  if (!auth.isLoggedIn || !product.value) return
  try {
    const response = await api.get('/wishlists')
    isWishlisted.value = response.data.wishlists?.some(w => w.product_id === product.value?.id)
  } catch (e) {
    // silently fail - non-critical
  }
}

async function addToCart() {
  if (!auth.isLoggedIn) {
    router.push(`/login?redirect=/products/${product.value.id}`)
    return
  }
  addingToCart.value = true
  try {
    await api.post('/cart', { product_id: product.value.id, quantity: quantity.value })
    toast.success(`Added ${quantity.value} item${quantity.value > 1 ? 's' : ''} to cart!`)
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to add to cart')
  } finally {
    addingToCart.value = false
  }
}

async function toggleWishlist() {
  if (!auth.isLoggedIn) {
    router.push(`/login?redirect=/products/${product.value.id}`)
    return
  }
  try {
    if (isWishlisted.value) {
      await api.delete(`/wishlists/${product.value.id}`)
      isWishlisted.value = false
      toast.info('Removed from wishlist')
    } else {
      await api.post('/wishlists', { product_id: product.value.id })
      isWishlisted.value = true
      toast.success('Added to wishlist!')
    }
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to update wishlist')
  }
}

async function submitReview() {
  if (!newReview.value.rating) {
    reviewError.value = 'Please select a rating'
    return
  }
  if (!newReview.value.comment.trim()) {
    reviewError.value = 'Please write a comment'
    return
  }
  submittingReview.value = true
  reviewError.value = ''
  try {
    await api.post('/reviews', {
      product_id: product.value.id,
      rating: newReview.value.rating,
      comment: newReview.value.comment,
    })
    toast.success('Review submitted successfully!')
    newReview.value = { rating: 0, comment: '' }
    // Reload just the product to get updated reviews
    await loadProduct()
  } catch (e) {
    reviewError.value = e.response?.data?.message || 'Failed to submit review'
  } finally {
    submittingReview.value = false
  }
}

async function retryLoad() {
  await loadProduct()
}

// Watchers
watch(() => route.params.id, () => {
  loadProduct()
})

// Lifecycle
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
/* ============ Breadcrumb ============ */
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
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: var(--primary);
}

.breadcrumb .current {
  color: var(--gray-800);
  font-weight: 600;
}

.breadcrumb-sep {
  color: var(--gray-300);
  font-size: 18px;
}

/* ============ Loading Skeleton ============ */
.loading-skeleton {
  padding: 20px 0;
}

.skeleton-breadcrumb {
  width: 200px;
  height: 16px;
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 24px;
}

.skeleton-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.skeleton-image {
  aspect-ratio: 1;
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-lg);
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.short { width: 30%; }
.skeleton-line.medium { width: 60%; }
.skeleton-line.long { width: 80%; }
.skeleton-line.full { width: 100%; }

.skeleton-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.skeleton-btn {
  height: 48px;
  border-radius: var(--radius);
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-btn:first-child { flex: 1; }
.skeleton-btn:last-child { width: 48px; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ============ Error State ============ */
.error-state {
  text-align: center;
  padding: 80px 20px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: shake 0.5s ease-in-out;
}

.error-state h2 {
  font-size: 24px;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.error-state p {
  color: var(--gray-500);
  margin-bottom: 24px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* ============ Product Detail Layout ============ */
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 60px;
}

/* ============ Product Gallery ============ */
.product-gallery {
  position: relative;
}

.main-image {
  position: relative;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 1;
  cursor: zoom-in;
  transition: box-shadow 0.3s;
}

.main-image:hover {
  box-shadow: var(--shadow-md);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
}

.zoom-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
  opacity: 0;
}

.main-image:hover .zoom-btn {
  opacity: 1;
}

.zoom-btn:hover {
  background: var(--white);
  box-shadow: var(--shadow-md);
}

.sale-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--danger);
  color: var(--white);
  padding: 6px 14px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.image-thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.image-thumbnails img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.image-thumbnails img:hover {
  border-color: var(--primary-light);
}

.image-thumbnails img.active {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

/* ============ Product Info ============ */
.product-category {
  display: inline-block;
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background: rgba(79, 70, 229, 0.08);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.product-title {
  font-size: 30px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 12px 0;
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.stars {
  font-size: 20px;
  color: var(--gray-300);
}

.stars span.filled {
  color: var(--secondary);
}

.rating-count {
  color: var(--gray-500);
  font-size: 14px;
}

.product-price-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.current-price {
  font-size: 34px;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}

.original-price {
  font-size: 20px;
  color: var(--gray-400);
  text-decoration: line-through;
}

.discount-badge {
  background: #fef2f2;
  color: var(--danger);
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 13px;
}

.product-description {
  color: var(--gray-600);
  line-height: 1.8;
  margin-bottom: 24px;
  font-size: 15px;
}

/* ============ Stock Section ============ */
.stock-section {
  margin-bottom: 24px;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stock-dot.in-stock {
  background: var(--success);
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

.stock-dot.out-of-stock {
  background: var(--danger);
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
}

.in-stock-text { color: var(--success); }
.low-stock { color: var(--danger); font-weight: 600; }
.medium-stock { color: var(--warning); }
.out-of-stock-text { color: var(--danger); font-weight: 600; }

.stock-bar {
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
}

.stock-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--success);
  transition: width 0.5s ease;
}

/* ============ Product Actions ============ */
.product-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  overflow: hidden;
}

.qty-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: var(--gray-50);
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-700);
}

.qty-btn:hover:not(:disabled) {
  background: var(--gray-200);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 56px;
  height: 44px;
  border: none;
  border-left: 1px solid var(--gray-300);
  border-right: 1px solid var(--gray-300);
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  -moz-appearance: textfield;
  appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-to-cart-btn {
  flex: 1;
  min-height: 48px;
  font-size: 15px;
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

.wishlist-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.wishlist-btn:hover {
  border-color: var(--danger);
  background: #fef2f2;
}

.wishlist-btn.active {
  border-color: var(--danger);
  background: #fef2f2;
}

/* ============ Product Meta ============ */
.product-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-icon {
  font-size: 20px;
}

.meta-content {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 12px;
  color: var(--gray-500);
}

.meta-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
}

/* ============ Related Products ============ */
.related-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 22px;
  color: var(--gray-900);
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 12px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.related-card {
  cursor: pointer;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--white);
  border: 1px solid var(--gray-200);
  transition: all 0.3s;
}

.related-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.related-image {
  height: 180px;
  overflow: hidden;
  background: var(--gray-50);
  position: relative;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.related-card:hover .related-image img {
  transform: scale(1.05);
}

.related-sale {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--danger);
  color: var(--white);
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
}

.related-info {
  padding: 12px;
}

.related-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-price {
  display: flex;
  align-items: center;
  gap: 6px;
}

.related-price .current {
  font-weight: 700;
  color: var(--primary);
  font-size: 15px;
}

.related-price .original {
  font-size: 12px;
  color: var(--gray-400);
  text-decoration: line-through;
}

/* ============ Reviews ============ */
.reviews-section {
  margin-bottom: 40px;
}

.reviews-section .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.reviews-section .card-header h2 {
  font-size: 20px;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-count {
  font-size: 16px;
  color: var(--gray-500);
  font-weight: 400;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-stars {
  font-size: 18px;
  color: var(--gray-300);
}

.rating-stars span.filled {
  color: var(--secondary);
}

.rating-avg {
  font-size: 14px;
  color: var(--gray-500);
  font-weight: 500;
}

.add-review {
  margin-bottom: 28px;
  padding: 20px;
  background: var(--gray-50);
  border-radius: var(--radius);
}

.add-review h3 {
  font-size: 16px;
  color: var(--gray-800);
  margin-bottom: 12px;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}

.star-select {
  font-size: 28px;
  color: var(--gray-300);
  cursor: pointer;
  transition: all 0.15s;
}

.star-select.active {
  color: var(--secondary);
}

.star-select:hover {
  transform: scale(1.2);
}

.rating-label {
  font-size: 14px;
  color: var(--gray-500);
  margin-left: 8px;
}

.review-form-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.form-error {
  color: var(--danger);
  font-size: 13px;
  margin-top: 8px;
}

.login-to-review {
  text-align: center;
  padding: 24px;
  color: var(--gray-500);
  font-size: 15px;
}

.login-link {
  color: var(--primary);
  font-weight: 600;
}

.no-reviews {
  text-align: center;
  padding: 40px;
  color: var(--gray-500);
}

.no-reviews-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--gray-100);
  transition: all 0.3s;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.review-avatar {
  width: 40px;
  height: 40px;
  background: var(--primary);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.review-user {
  flex: 1;
}

.review-user strong {
  font-size: 14px;
  color: var(--gray-800);
  display: block;
  margin-bottom: 2px;
}

.review-stars {
  font-size: 14px;
  color: var(--gray-300);
}

.review-stars span.filled {
  color: var(--secondary);
}

.review-date {
  font-size: 12px;
  color: var(--gray-400);
}

.review-comment {
  color: var(--gray-600);
  font-size: 14px;
  line-height: 1.6;
}

/* ============ Transitions ============ */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.heart-enter-active,
.heart-leave-active {
  transition: all 0.2s ease;
}

.heart-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.heart-leave-to {
  opacity: 0;
  transform: scale(1.5);
}

.review-list-enter-active {
  transition: all 0.4s ease;
}

.review-list-leave-active {
  transition: all 0.3s ease;
}

.review-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.review-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* ============ Lightbox ============ */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-nav.prev { left: -60px; }
.lightbox-nav.next { right: -60px; }

.lightbox-counter {
  position: absolute;
  bottom: -36px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.lightbox-enter-active {
  transition: opacity 0.3s ease;
}

.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* ============ Responsive ============ */
@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-meta-grid {
    grid-template-columns: 1fr;
  }

  .breadcrumb {
    font-size: 12px;
  }

  .product-title {
    font-size: 22px;
  }

  .current-price {
    font-size: 26px;
  }

  .skeleton-detail {
    grid-template-columns: 1fr;
  }

  .lightbox-nav.prev { left: 10px; }
  .lightbox-nav.next { right: 10px; }
  .lightbox-close { top: -44px; right: 0; }
}
</style>