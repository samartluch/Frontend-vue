import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  function show(message, type = 'success', duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type, visible: false })

    setTimeout(() => {
      const toast = toasts.value.find(t => t.id === id)
      if (toast) toast.visible = true
    }, 10)

    setTimeout(() => {
      const toast = toasts.value.find(t => t.id === id)
      if (toast) toast.visible = false
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, 300)
    }, duration)
  }

  function success(message) {
    show(message, 'success')
  }

  function error(message) {
    show(message, 'error', 5000)
  }

  function warning(message) {
    show(message, 'warning', 4000)
  }

  function info(message) {
    show(message, 'info', 3000)
  }

  return { toasts, show, success, error, warning, info }
}