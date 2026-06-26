<template>
  <footer class="footer">
    <div class="container footer-container">
      <!-- Newsletter -->
      <div class="footer-newsletter">
        <div class="newsletter-content">
          <h3>Stay in the Loop</h3>
          <p>Subscribe to get special offers, free giveaways, and exclusive deals.</p>
        </div>
        <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
          />
          <button type="submit" class="btn btn-primary" :disabled="subscribing">
            {{ subscribing ? 'Subscribing...' : 'Subscribe' }}
          </button>
        </form>
      </div>

      <div class="footer-grid">
        <div class="footer-section">
          <h3>🛍️ ShopEase</h3>
          <p>Your one-stop shop for everything you need. Quality products at great prices with fast delivery.</p>
          <div class="social-links">
            <a href="#" class="social-link" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" class="social-link" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" class="social-link" title="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="#" class="social-link" title="Email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <router-link to="/" class="footer-link">Home</router-link>
          <router-link to="/products" class="footer-link">Products</router-link>
          <router-link to="/cart" class="footer-link">Cart</router-link>
          <router-link to="/orders" class="footer-link">Orders</router-link>
        </div>

        <div class="footer-section">
          <h4>Account</h4>
          <router-link v-if="!auth.isLoggedIn" to="/login" class="footer-link">Login</router-link>
          <router-link v-if="!auth.isLoggedIn" to="/register" class="footer-link">Register</router-link>
          <router-link v-if="auth.isLoggedIn" to="/profile" class="footer-link">Profile</router-link>
          <router-link v-if="auth.isLoggedIn" to="/wishlist" class="footer-link">Wishlist</router-link>
        </div>

        <div class="footer-section">
          <h4>Contact</h4>
          <div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>123 Shopping Street</span>
          </div>
          <div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>+1 234 567 890</span>
          </div>
          <div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>info@shopease.com</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} ShopEase. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const auth = useAuthStore()
const toast = useToast()
const email = ref('')
const subscribing = ref(false)

async function subscribeNewsletter() {
  if (!email.value.trim()) return
  subscribing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  toast.success('Subscribed successfully! Check your email for updates.')
  email.value = ''
  subscribing.value = false
}
</script>

<style scoped>
.footer {
  background: var(--gray-900);
  color: var(--gray-300);
  padding: 0;
  margin-top: 60px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Newsletter */
.footer-newsletter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 40px 0;
  border-bottom: 1px solid var(--gray-800);
  flex-wrap: wrap;
}

.newsletter-content h3 {
  color: var(--white);
  font-size: 20px;
  margin-bottom: 4px;
}

.newsletter-content p {
  font-size: 14px;
  color: var(--gray-400);
}

.newsletter-form {
  display: flex;
  gap: 0;
  min-width: 400px;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--gray-700);
  border-radius: var(--radius) 0 0 var(--radius);
  background: var(--gray-800);
  color: var(--white);
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.newsletter-form input:focus {
  border-color: var(--primary);
}

.newsletter-form input::placeholder {
  color: var(--gray-500);
}

.newsletter-form .btn {
  border-radius: 0 var(--radius) var(--radius) 0;
  padding: 12px 24px;
}

/* Footer Grid */
.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 48px 0;
}

.footer-section h3 {
  color: var(--white);
  font-size: 22px;
  margin-bottom: 16px;
}

.footer-section h4 {
  color: var(--white);
  font-size: 16px;
  margin-bottom: 16px;
  position: relative;
  padding-bottom: 8px;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--primary);
}

.footer-section p {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 8px;
}

.footer-link {
  display: block;
  color: var(--gray-400);
  text-decoration: none;
  font-size: 14px;
  padding: 5px 0;
  transition: color 0.3s, padding-left 0.3s;
}

.footer-link:hover {
  color: var(--primary-light);
  padding-left: 4px;
}

.social-links {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.social-link {
  width: 36px;
  height: 36px;
  background: var(--gray-800);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s;
  text-decoration: none;
  color: var(--gray-400);
}

.social-link:hover {
  background: var(--primary);
  color: var(--white);
  transform: translateY(-2px);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  margin-bottom: 10px;
  color: var(--gray-400);
}

.contact-item svg {
  flex-shrink: 0;
  color: var(--primary-light);
}

.footer-bottom {
  border-top: 1px solid var(--gray-800);
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: var(--gray-500);
}

.footer-bottom-links {
  display: flex;
  gap: 20px;
}

.footer-bottom-links a {
  color: var(--gray-500);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-bottom-links a:hover {
  color: var(--primary-light);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .newsletter-form {
    min-width: 100%;
  }

  .footer-newsletter {
    flex-direction: column;
    text-align: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>