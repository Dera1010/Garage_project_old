<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from './ui/Button.vue'
import Sidebar from './ui/Sidebar.vue'
import '../assets/css/bootstrap.css' 

const router = useRouter()

const emit = defineEmits<{
  logout: []
}>()

const menuItems = ref([
  { name: 'Dashboard', icon: '📊', path: '/dashboard' },
  { 
    name: 'Interventions', 
    icon: '📦', 
    isOpen: false,
    children: [
      { name: 'Liste des interventions', path: '/interventions' },
      { name: 'Ajouter intervention', path: '/element' },
    ]
  },
])

const handleLogout = () => {
  emit('logout')
  router.push('/')
}

const goToFrontOffice = () => {
  router.push('/front-office')
}

</script>

<template>
  <div class="layout">
    <Sidebar :menuItems="menuItems" logo="Backoffice" logoCollapsed="BO">
      <template #footer>
        <Button @click="handleLogout" :title="'Déconnexion'" fullWidth>
          <span class="nav-text">Déconnexion</span> 
          <span class="nav-icon glyphicon glyphicon-log-out"></span>
        </Button>
      </template>
    </Sidebar>

    <!-- Main Content -->
    <div class="main-content">
      <header class="content-header">
        <h1>{{ $route.name || 'Dashboard' }}</h1>
        <div class="header-right">
          <Button variant="outline" size="sm" @click="goToFrontOffice" class="frontoffice-btn">
            <span class="glyphicon glyphicon-globe"></span>
            Front Office
          </Button>
          <div class="user-info">
            <span class="user-avatar guest">👤</span>
            <span class="user-name">Admin</span>
          </div>
        </div>
      </header>

      <main class="content-body">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f3f4f6;
  overflow: hidden;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  text-transform: capitalize;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.frontoffice-btn {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.user-avatar.guest {
  background: #cbd5e1;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
}

.content-body {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.nav-text {
  margin-right: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>
