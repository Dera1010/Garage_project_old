<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import Layout from '../components/Layout.vue'
import Toast from '../components/ui/Toast.vue'
import Button from '../components/ui/Button.vue'

interface Intervention {
  id: number
  nom: string
  prix: number
  time: number
  created_at: string
}

const router = useRouter()
const interventions = ref<Intervention[]>([])
const loading = ref(true)
const searchQuery = ref('')

const filteredInterventions = computed(() => {
  if (!searchQuery.value) return interventions.value
  const query = searchQuery.value.toLowerCase()
  return interventions.value.filter(item => 
    item.nom.toLowerCase().includes(query) || 
    item.id.toString().includes(query) ||
    item.prix.toString().includes(query) ||
    item.time.toString().includes(query)
  )
})

// Toast state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const triggerToast = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

const fetchInterventions = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/interventions')
    interventions.value = response.data
  } catch (error) {
    console.error('Error fetching interventions:', error)
    triggerToast('Erreur lors du chargement des interventions', 'error')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) return

  try {
    await axios.delete(`http://127.0.0.1:8000/api/interventions/${id}`)
    interventions.value = interventions.value.filter(i => i.id !== id)
    triggerToast('Intervention supprimée avec succès', 'success')
  } catch (error) {
    console.error('Error deleting intervention:', error)
    triggerToast('Erreur lors de la suppression', 'error')
  }
}

const handleEdit = (intervention: Intervention) => {
  router.push(`/element/edit/${intervention.id}`)
}


onMounted(() => {
  fetchInterventions()
})
</script>

<template>
  <Layout>
    <Toast 
      v-if="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      @close="showToast = false" 
    />

    <div class="list-container">
      <div class="header-actions">
        <h2>Liste des interventions</h2>
        <router-link to="/element">
          <Button variant="primary">Ajouter une intervention</Button>
        </router-link>
      </div>

      <div class="search-bar">
        <span class="search-icon glyphicon glyphicon-search"></span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher par nom ou ID..." 
          class="search-input"
        />
      </div>

      <div v-if="loading" class="loading-state">
        Chargement...
      </div>

      <div v-else class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prix (Ar)</th>
              <th>Durée</th>
              <th>Créé le</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredInterventions" :key="item.id">
              <td>{{ item.id }}</td>
              <td><strong>{{ item.nom }}</strong></td>
              <td>{{ item.prix }}</td>
              <td>{{ item.time }}</td>
              <td>{{ new Date(item.created_at).toLocaleDateString() }}</td>
              <td class="actions-cell">
                <button class="btn-action edit" @click="handleEdit(item)" title="Modifier">
                  <span class="glyphicon glyphicon-pencil"></span>
                </button>
                <button class="btn-action delete" @click="handleDelete(item.id)" title="Supprimer">
                  <span class="glyphicon glyphicon-trash"></span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredInterventions.length === 0">
              <td colspan="6" class="empty-state">
                {{ searchQuery ? 'Aucun résultat correspondant à votre recherche' : 'Aucune intervention trouvée' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
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
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background: #fbfbfb;
}

.actions-column {
  width: 120px;
  text-align: center;
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.btn-action.edit {
  background: #3b82f6;
}

.btn-action.edit:hover {
  background: #2563eb;
}

.btn-action.delete {
  background: #ef4444;
}

.btn-action.delete:hover {
  background: #dc2626;
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
