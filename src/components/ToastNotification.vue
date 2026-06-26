<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast-item', toast.type, { visible: toast.visible }]"
      >
        <span class="toast-icon">
          <template v-if="toast.type === 'success'">✓</template>
          <template v-else-if="toast.type === 'error'">✕</template>
          <template v-else-if="toast.type === 'warning'">⚠</template>
          <template v-else>ℹ</template>
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { toRef } from 'vue'

const props = defineProps({
  toasts: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  font-size: 14px;
  font-weight: 500;
  min-width: 300px;
  max-width: 420px;
  transform: translateX(120%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: auto;
}

.toast-item.visible {
  transform: translateX(0);
  opacity: 1;
}

.toast-item.success {
  background: #ecfdf5;
  color: #065f46;
  border-left: 4px solid var(--success);
}

.toast-item.error {
  background: #fef2f2;
  color: #991b1b;
  border-left: 4px solid var(--danger);
}

.toast-item.warning {
  background: #fffbeb;
  color: #92400e;
  border-left: 4px solid var(--warning);
}

.toast-item.info {
  background: #eff6ff;
  color: #1e40af;
  border-left: 4px solid var(--info);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.success .toast-icon {
  background: #d1fae5;
  color: var(--success);
}

.error .toast-icon {
  background: #fee2e2;
  color: var(--danger);
}

.warning .toast-icon {
  background: #fef3c7;
  color: var(--warning);
}

.info .toast-icon {
  background: #dbeafe;
  color: var(--info);
}

.toast-message {
  flex: 1;
}

.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  transform: translateX(120%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(120%);
  opacity: 0;
}
</style>