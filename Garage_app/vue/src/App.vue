<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Login from './views/Login.vue'

const router = useRouter()

// Check localStorage for existing auth state
const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

// Redirect to dashboard if already authenticated
if (isAuthenticated.value && router.currentRoute.value.path === '/') {
  router.push('/dashboard')
}

const handleLogin = () => {
  isAuthenticated.value = true
  localStorage.setItem('isAuthenticated', 'true')
}

const handleLogout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('isAuthenticated')
  router.push('/')
}
</script>

<template>
  <div class="app-container">
    <Login v-if="!isAuthenticated" @login="handleLogin" />
    <router-view v-else @logout="handleLogout" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.app-container:has(.login-card) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>

<!--<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>-->
