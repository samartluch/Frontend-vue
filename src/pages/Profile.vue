<template>
  <div class="page-content">
    <div class="container">
      <div class="page-header">
        <h1>My Profile</h1>
        <p>Manage your account settings</p>
      </div>

      <div class="profile-layout">
        <!-- Profile Info -->
        <div class="card">
          <div class="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <h2>Personal Information</h2>
          </div>
          <div class="card-body">
            <div v-if="profileSuccess" class="alert alert-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              {{ profileSuccess }}
            </div>
            <div v-if="profileError" class="alert alert-danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              {{ profileError }}
            </div>

            <form @submit.prevent="updateProfile">
              <div class="form-group">
                <label class="form-label">Name</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input v-model="profileForm.name" type="text" class="form-input" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Email</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input v-model="profileForm.email" type="email" class="form-input" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Phone</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <input v-model="profileForm.phone" type="text" class="form-input" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Address</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <textarea v-model="profileForm.address" class="form-textarea"></textarea>
                </div>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="profileUpdating">
                <span v-if="profileUpdating" class="btn-spinner"></span>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                {{ profileUpdating ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Change Password -->
        <div class="card">
          <div class="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <h2>Change Password</h2>
          </div>
          <div class="card-body">
            <div v-if="passwordSuccess" class="alert alert-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              {{ passwordSuccess }}
            </div>
            <div v-if="passwordError" class="alert alert-danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              {{ passwordError }}
            </div>

            <form @submit.prevent="changePassword">
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input v-model="passwordForm.current_password" type="password" class="form-input" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">New Password</label>
                <div class="input-icon-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input v-model="passwordForm.new_password" type="password" class="form-input" required minlength="6" />
                </div>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="passwordUpdating">
                <span v-if="passwordUpdating" class="btn-spinner"></span>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                {{ passwordUpdating ? 'Updating...' : 'Change Password' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
})
const profileUpdating = ref(false)
const profileSuccess = ref('')
const profileError = ref('')

const passwordForm = reactive({
  current_password: '',
  new_password: '',
})
const passwordUpdating = ref(false)
const passwordSuccess = ref('')
const passwordError = ref('')

onMounted(() => {
  profileForm.name = auth.currentUser?.name || ''
  profileForm.email = auth.currentUser?.email || ''
  profileForm.phone = auth.currentUser?.phone || ''
  profileForm.address = auth.currentUser?.address || ''
})

async function updateProfile() {
  profileUpdating.value = true
  profileSuccess.value = ''
  profileError.value = ''
  try {
    await auth.updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      address: profileForm.address,
    })
    profileSuccess.value = 'Profile updated successfully!'
  } catch (e) {
    const errors = e.response?.data?.errors
    if (errors) {
      profileError.value = Object.values(errors).flat().join(', ')
    } else {
      profileError.value = e.response?.data?.message || 'Failed to update profile'
    }
  } finally {
    profileUpdating.value = false
  }
}

async function changePassword() {
  passwordUpdating.value = true
  passwordSuccess.value = ''
  passwordError.value = ''
  try {
    await auth.changePassword(passwordForm.current_password, passwordForm.new_password)
    passwordSuccess.value = 'Password changed successfully!'
    passwordForm.current_password = ''
    passwordForm.new_password = ''
  } catch (e) {
    passwordError.value = e.response?.data?.message || 'Failed to change password'
  } finally {
    passwordUpdating.value = false
  }
}
</script>

<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding-top: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header h2 {
  font-size: 16px;
  color: var(--gray-800);
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
.input-icon-wrapper .form-textarea {
  padding-left: 40px;
  width: 100%;
}

.input-icon-wrapper .form-textarea {
  min-height: 80px;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
}
</style>