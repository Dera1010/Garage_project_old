<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import LayoutFront from '../components/LayoutFront.vue'

interface Client {
    name: string
    email: string
}

const clients = ref<Client[]>([])
const loading = ref(true)
const searchQuery = ref('')

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value
  const query = searchQuery.value.toLowerCase()
  return clients.value.filter(client => 
    (client.name && client.name.toLowerCase().includes(query)) || 
    (client.email && client.email.toLowerCase().includes(query))
  )
})

const fetchClients = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${API_BASE_URL}/api/list-client`)
        // Handle paginated response structure
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
            clients.value = response.data.data
        } else if (Array.isArray(response.data)) {
            clients.value = response.data
        } else {
            console.warn('Structure de réponse API inattendue:', response.data)
            clients.value = []
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
  fetchClients()
})
</script>

<template>
  <LayoutFront>
    <div class="list-container">
      <div class="header-actions">
        <h2>Répertoire des Clients</h2>
      </div>

      <div class="search-bar">
        <span class="search-icon glyphicon glyphicon-search"></span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher par nom ou email..." 
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
              <th>Avatar</th>
              <th>Nom</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(client, index) in filteredClients" :key="index">
              <td>
                <div class="client-avatar">{{ client.name ? client.name.toUpperCase() : 'C' }}</div>
              </td>
              <td><strong>{{ client.name || 'Client sans nom' }}</strong></td>
              <td>{{ client.email || 'Pas d\'email' }}</td>
            </tr>
            <tr v-if="filteredClients.length === 0">
              <td colspan="3" class="empty-state">
                {{ searchQuery ? 'Aucun résultat correspondant à votre recherche' : 'Aucun client trouvé' }}
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

.client-avatar {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
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
