<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import Layout from '../components/Layout.vue'

const emit = defineEmits<{
  logout: []
}>()

const stats = ref({
  total_interventions: 0,
  total_revenue: 0,
  average_time: 0,
  total_client: 0
})
const loading = ref(true)

const fetchStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stats`)
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  emit('logout')
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <Layout @logout="handleLogout">
    <div class="welcome-card">
      <h2>Bienvenue, Admin!</h2>
      <p>Voici l'état actuel de votre activité.</p>
    </div>

    <div v-if="loading" class="loading-state">
      Chargement des données...
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card">
        <h3>Interventions</h3>
        <p class="stat-number">{{ stats.total_interventions }}</p>
        <p class="stat-label">Total disponible</p>
      </div>
      <div class="stat-card">
        <h3>Montant total des interventions</h3>
        <p class="stat-number">{{ stats.total_revenue.toLocaleString() }} Ar</p>
        <p class="stat-label">Prix total</p>
      </div>
      <div class="stat-card">
        <h3>Temps Moyen</h3>
        <p class="stat-number">{{ stats.average_time }}</p>
        <p class="stat-label">Minutes par intervention</p>
      </div>
      <div class="stat-card">
        <h3>Nombre total client</h3>
        <p class="stat-number">{{ stats.total_client }}</p>
        <p class="stat-label">Clients</p>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.welcome-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.welcome-card h2 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.welcome-card p {
  margin: 0;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.15s ease-in-out;
  display: flex;
  flex-direction: column;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-number {
  margin: 0;
  color: #1f2937;
  font-size: 2.25rem;
  font-weight: 800;
}

.stat-label {
  margin: 0.5rem 0 0 0;
  color: #9ca3af;
  font-size: 0.75rem;
}

.loading-state {
  padding: 3rem;
  text-align: center;
  background: white;
  border-radius: 0.75rem;
  color: #6b7280;
}
</style>
