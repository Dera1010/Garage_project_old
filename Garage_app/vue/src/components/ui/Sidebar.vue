<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface MenuItem {
  name: string
  icon: string
  path?: string
  isOpen?: boolean
  children?: { name: string; path: string }[]
}

const props = defineProps<{
  menuItems: MenuItem[]
  logo: string
  logoCollapsed: string
}>()

const router = useRouter()
const route = useRoute()

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleSubmenu = (item: MenuItem) => {
  if (item.children) {
    item.isOpen = !item.isOpen
  } else if (item.path) {
    navigateTo(item.path)
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}

// Logic to keep dropdown open if child route is active
const syncDropdownState = () => {
  props.menuItems.forEach(item => {
    if (item.children) {
      const hasActiveChild = item.children.some(child => 
        route.path === child.path || (route.path.startsWith('/element/edit/') && item.name === 'Interventions')
      )
      if (hasActiveChild) {
        item.isOpen = true
      }
    }
  })
}

watch(() => route.path, () => {
  syncDropdownState()
})

onMounted(() => {
  syncDropdownState()
})

defineExpose({
  isSidebarCollapsed
})
</script>

<template>
  <aside :class="['sidebar', { collapsed: isSidebarCollapsed }]">
    <div class="sidebar-header">
      <h2 v-if="!isSidebarCollapsed" class="logo">{{ logo }}</h2>
      <h2 v-else class="logo-collapsed">{{ logoCollapsed }}</h2>
      <button @click="toggleSidebar" class="toggle-btn">
        <span :class="isSidebarCollapsed ? 'glyphicon glyphicon-chevron-right' : 'glyphicon glyphicon-chevron-left'"></span>
      </button>
    </div>

    <nav class="sidebar-nav">
      <div v-for="item in menuItems" :key="item.name" class="nav-item-container">
        <button
          @click="toggleSubmenu(item)"
          :class="['nav-item', { active: route.path === item.path && !item.children }]"
          :title="item.name"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!isSidebarCollapsed" class="nav-text">{{ item.name }}</span>
          <span v-if="!isSidebarCollapsed && item.children" class="dropdown-arrow">
            <span :class="item.isOpen ? 'glyphicon glyphicon-chevron-down' : 'glyphicon glyphicon-chevron-right'"></span>
          </span>
        </button>
        
        <div v-if="!isSidebarCollapsed && item.children && item.isOpen" class="submenu">
          <button
            v-for="child in item.children"
            :key="child.path"
            @click="navigateTo(child.path)"
            :class="['submenu-item', { active: route.path === child.path }]"
          >
            {{ child.name }}
          </button>
        </div>
      </div>
    </nav>

    <div class="sidebar-footer">
      <slot name="footer"></slot>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100%;
  background: whitesmoke;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.sidebar.collapsed {
  width: 100px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.logo {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  white-space: nowrap;
  color: #1f2937;
}

.logo-collapsed {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.toggle-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.toggle-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  font-size: 0.875rem;
  color: #4b5563;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0.875rem;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1f2937;
}

.nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.nav-text {
  white-space: nowrap;
  flex: 1;
}

.dropdown-arrow {
  font-size: 0.75rem;
  opacity: 0.7;
}

.submenu {
  background: rgba(0, 0, 0, 0.03);
  padding: 0.25rem 0;
}

.submenu-item {
  width: 100%;
  padding: 0.75rem 1.5rem 0.75rem 3.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 0.8125rem;
  color: #4b5563;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.submenu-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1f2937;
}

.submenu-item.active {
  color: #3b82f6;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.05);
}

.nav-item.active {
  background: rgba(0, 0, 0, 0.05);
  color: #3b82f6;
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
  }
  .sidebar.collapsed {
    width: 0;
    overflow: hidden;
  }
}
</style>
