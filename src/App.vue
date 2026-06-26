<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
    <ToastNotification :toasts="toasts" />
  </div>
</template>

<script setup>
import Navbar from './layouts/Navbar.vue'
import Footer from './layouts/Footer.vue'
import ToastNotification from './components/ToastNotification.vue'
import { useToast } from './composables/useToast'

const { toasts } = useToast()
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app > .page-content {
  flex: 1;
}
</style>