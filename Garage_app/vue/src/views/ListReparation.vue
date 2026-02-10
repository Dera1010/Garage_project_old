<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import LayoutFront from '../components/LayoutFront.vue'

interface Reparation {
    id: number
    client: string
    intervention: string
    status: string
    progress: number
    estimation: string
}

const reparations = ref<Reparation[]>([])
const loading = ref(true)
const searchQuery = ref('')

const filteredReparations = computed(() => {
  if (!searchQuery.value) return reparations.value
  const query = searchQuery.value.toLowerCase()
  return reparations.value.filter(reparation => 
    (reparation.client && reparation.client.toLowerCase().includes(query)) || 
    (reparation.intervention && reparation.intervention.toLowerCase().includes(query)) ||
    (reparation.status && reparation.status.toLowerCase().includes(query))
  )
})

const fetchReparations = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${API_BASE_URL}/api/ongoing-repairs`)
        if (Array.isArray(response.data)) {
            reparations.value = response.data
        } else {
            console.warn('Structure de réponse API inattendue:', response.data)
            reparations.value = []
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des réparations:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
  fetchReparations()
})

const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('terminé')) return 'status-completed';
    if (s.includes('cours')) return 'status-progress';
    return 'status-pending';
}
</script>

<template>
  <LayoutFront>
    <div class="list-container">
      <div class="header-actions">
        <h2>Liste des réparations en cours</h2>
      </div>

      <div class="search-bar">
        <span class="search-icon glyphicon glyphicon-search"></span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher par client, intervention..." 
          class="search-input"
        />
      </div>

      <div v-if="loading" class="loading-state">
        Chargement des données...
      </div>

      <div v-else class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Intervention</th>
              <th>Statut</th>
              <th>Estimation</th>
              <th>Progression</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="repair in filteredReparations" :key="repair.id">
              <td><strong>{{ repair.client }}</strong></td>
              <td>{{ repair.intervention }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(repair.status)">
                    {{ repair.status }}
                </span>
              </td>
              <td>{{ repair.estimation }}</td>
              <td>
                <div class="progress-bar-container">
                    <div class="progress-bar" :style="{ width: repair.progress + '%' }"></div>
                </div>
                <small>{{ repair.progress }}%</small>
              </td>
            </tr>
            <tr v-if="filteredReparations.length === 0">
              <td colspan="5" class="empty-state">
                {{ searchQuery ? 'Aucun résultat correspondant à votre recherche' : 'Aucune réparation en cours' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </LayoutFront>
</template>

<style scoped>
.list-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.search-bar {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  background: #f9fafb;
  padding: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background: #fbfbfb;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}

.status-completed {
    background-color: #d1fae5;
    color: #065f46;
}

.status-progress {
    background-color: #dbeafe;
    color: #1e40af;
}

.status-pending {
    background-color: #f3f4f6;
    color: #374151;
}

.progress-bar-container {
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.25rem;
}

.progress-bar {
    height: 100%;
    background-color: #3b82f6;
    transition: width 0.3s ease;
}

.loading-state, .empty-state {
  padding: 3rem;
  text-align: center;
  background: white;
  border-radius: 0.75rem;
  color: #6b7280;
}

.empty-state {
  font-style: italic;
}
</style>
