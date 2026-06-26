<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text fade-in">
          <span class="hero-badge">🔥 New Collection Available</span>
          <h1>Discover Amazing <span class="highlight">Products</span></h1>
          <p>Shop the latest trends with unbeatable prices. Quality products delivered to your doorstep with fast, free shipping.</p>
          <div class="hero-actions">
            <router-link to="/products" class="btn btn-primary btn-lg pulse-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="10" cy="20" r="2"></circle>
                <circle cx="18" cy="20" r="2"></circle>
                <path d="M2.5 2.5h3l2.7 11.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 5.5H4.5"></path>
              </svg>
              Shop Now
            </router-link>
            <router-link to="/products" class="btn btn-outline btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              Browse Categories
            </router-link>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">10K+</span>
              <span class="stat-label">Products</span>
            </div>
            <div class="stat">
              <span class="stat-number">5K+</span>
              <span class="stat-label">Happy Customers</span>
            </div>
            <div class="stat">
              <span class="stat-number">99%</span>
              <span class="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
        <div class="hero-image fade-in">
          <div class="hero-image-wrapper">
            <img src="../assets/hero.png" alt="Shopping" />
            <div class="floating-badge badge-1">
              <span>🎉</span>
              <span>50% Off</span>
            </div>
            <div class="floating-badge badge-2">
              <span>🚚</span>
              <span>Free Ship</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Shop by Category</h2>
            <p class="section-subtitle">Browse our wide range of categories</p>
          </div>
          <router-link to="/products" class="btn btn-outline btn-sm">View All</router-link>
        </div>
        <div v-if="categoriesLoading" class="loading">
          <div class="loading-spinner"></div>
        </div>
        <div v-else class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            @click="goToCategory(category)"
          >
            <div class="category-icon">{{ getCategoryIcon(category.name) }}</div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.products_count }} products</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section section-gray">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Featured Products</h2>
            <p class="section-subtitle">Check out our most popular items</p>
          </div>
          <router-link to="/products" class="btn btn-primary btn-sm">View All</router-link>
        </div>
        <div v-if="productsLoading" class="loading">
          <div class="loading-spinner"></div>
        </div>
        <div v-else class="grid grid-4">
          <div v-for="product in products" :key="product.id" class="product-card card" @click="goToProduct(product)">
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
                <button class="add-mini-btn" @click.stop="quickAdd(product)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-8">
          <router-link to="/products" class="btn btn-primary">View All Products</router-link>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center">What Our Customers Say</h2>
        <p class="section-subtitle text-center">Trusted by thousands of happy shoppers</p>
        <div class="testimonials-grid">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="testimonial-card">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">{{ testimonial.name[0] }}</div>
              <div>
                <strong>{{ testimonial.name }}</strong>
                <span>{{ testimonial.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section section-gray">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <h3>Free Shipping</h3>
            <p>Free shipping on orders over $50</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3>Secure Payment</h3>
            <p>100% secure payment processing</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            </div>
            <h3>Easy Returns</h3>
            <p>30-day hassle-free return policy</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock customer support</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

const router = useRouter()
const categories = ref([])
const products = ref([])
const categoriesLoading = ref(true)
const productsLoading = ref(true)

const testimonials = [
  { text: 'Amazing shopping experience! The quality exceeded my expectations and delivery was incredibly fast.', name: 'Sarah Johnson', title: 'Verified Buyer' },
  { text: 'Best prices I could find online. The customer service team was super helpful with my questions.', name: 'Michael Chen', title: 'Regular Customer' },
  { text: 'I love the easy return policy and the wide selection of products. Highly recommend!', name: 'Emily Rodriguez', title: 'Fashion Enthusiast' },
]

function getCategoryIcon(name) {
  const icons = {
    Electronics: '💻',
    Clothing: '👕',
    Shoes: '👟',
    Books: '📚',
    Home: '🏠',
    Sports: '⚽',
    Beauty: '💄',
    Food: '🍕',
    Toys: '🧸',
    Music: '🎵',
    Garden: '🌿',
    Automotive: '🚗',
  }
  return icons[name] || '📦'
}

function getProductImage(product) {
  if (product.image) return `http://localhost:8000/storage/${product.image}`
  if (product.images && product.images.length > 0) return `http://localhost:8000/storage/${product.images[0]}`
  return '/placeholder-product.svg'
}

function goToProduct(product) {
  router.push({ name: 'ProductDetail', params: { id: product.id } })
}

function quickAdd(product) {
  router.push({ name: 'ProductDetail', params: { id: product.id } })
}

function goToCategory(category) {
  router.push({ name: 'Products', query: { category_id: category.id } })
}

async function loadCategories() {
  try {
    const response = await api.get('/categories')
    categories.value = response.data.categories
  } catch (e) {
    console.error('Failed to load categories:', e)
  } finally {
    categoriesLoading.value = false
  }
}

async function loadProducts() {
  try {
    const response = await api.get('/products?per_page=8')
    products.value = response.data.data
  } catch (e) {
    console.error('Failed to load products:', e)
  } finally {
    productsLoading.value = false
  }
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--primary) 0%, #4338ca 50%, var(--primary-darker) 100%);
  color: var(--white);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
}

.hero-text h1 {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 16px;
}

.hero-text .highlight {
  background: linear-gradient(135deg, var(--secondary), #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-text p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 32px;
  line-height: 1.7;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.hero-actions .btn-primary {
  background: var(--white);
  color: var(--primary);
}

.hero-actions .btn-primary:hover {
  background: var(--gray-100);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.hero-actions .btn-outline {
  border-color: rgba(255,255,255,0.5);
  color: var(--white);
  backdrop-filter: blur(10px);
}

.hero-actions .btn-outline:hover {
  background: var(--white);
  color: var(--primary);
  border-color: var(--white);
}

.pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
  50% { box-shadow: 0 0 20px 8px rgba(255,255,255,0.1); }
}

.hero-stats {
  display: flex;
  gap: 32px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  opacity: 0.7;
  margin-top: 4px;
}

.hero-image {
  position: relative;
}

.hero-image-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.hero-image-wrapper img {
  width: 100%;
  max-width: 500px;
  display: block;
  animation: floatImg 6s ease-in-out infinite;
}

@keyframes floatImg {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.floating-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--white);
  color: var(--gray-800);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: var(--shadow-lg);
  animation: floatBadge 4s ease-in-out infinite;
}

.badge-1 {
  top: 10%;
  right: 0;
  animation-delay: 0s;
}

.badge-2 {
  bottom: 20%;
  left: 0;
  animation-delay: 1.5s;
}

@keyframes floatBadge {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(2deg); }
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-gray {
  background: var(--gray-100);
}

.text-center {
  text-align: center;
}

.mt-8 {
  margin-top: 32px;
}

/* Categories */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.category-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 28px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-100);
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-light);
}

.category-icon {
  font-size: 40px;
  margin-bottom: 12px;
  transition: transform 0.3s;
}

.category-card:hover .category-icon {
  transform: scale(1.15);
}

.category-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.category-card p {
  font-size: 12px;
  color: var(--gray-500);
}

/* Products */
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
  height: 200px;
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
  font-size: 14px;
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
  font-size: 16px;
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
  width: 32px;
  height: 32px;
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

/* Testimonials */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.testimonial-card {
  background: var(--white);
  padding: 28px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  transition: all 0.3s;
  border: 1px solid var(--gray-100);
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.testimonial-stars {
  color: var(--secondary);
  font-size: 18px;
  margin-bottom: 12px;
}

.testimonial-text {
  color: var(--gray-600);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 16px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testimonial-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.testimonial-author strong {
  display: block;
  font-size: 14px;
  color: var(--gray-800);
}

.testimonial-author span {
  font-size: 12px;
  color: var(--gray-500);
}

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  text-align: center;
  padding: 32px 20px;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon-wrapper {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  background: var(--primary-lighter);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  transition: all 0.3s;
}

.feature-card:hover .feature-icon-wrapper {
  background: var(--primary);
  color: white;
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 14px;
  color: var(--gray-500);
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-text h1 {
    font-size: 34px;
  }

  .hero-text p {
    margin: 0 auto 32px;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-image {
    display: none;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .hero-text h1 {
    font-size: 28px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    gap: 24px;
    flex-wrap: wrap;
  }
}
</style>