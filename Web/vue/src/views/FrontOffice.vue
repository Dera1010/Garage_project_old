<script setup lang="ts">
import { ref } from 'vue'
import LayoutFront from '../components/LayoutFront.vue'

// Mock Data
const clients = ref([
  { id: 1, name: 'Jean Dupont', car: 'Toyota Corolla', phone: '034 11 222 33' },
  { id: 2, name: 'Marie Rakoto', car: 'Peugeot 208', phone: '032 44 555 66' },
  { id: 3, name: 'Pierre Durand', car: 'Renault Clio', phone: '033 77 888 99' },
])

const activeRepairs = ref([
  { id: 101, client: 'Jean Dupont', status: 'En cours', progress: 65, estimation: '1h 30min' },
  { id: 102, client: 'Marie Rakoto', status: 'En attente', progress: 10, estimation: '3h 00min' },
  { id: 103, client: 'Michel Morel', status: 'Terminé', progress: 100, estimation: 'Terminé' },
])

const getStatusClass = (status: string) => {
  switch (status) {
    case 'En cours': return 'status-ongoing'
    case 'En attente': return 'status-pending'
    case 'Terminé': return 'status-completed'
    default: return ''
  }
}
</script>

<template>
  <LayoutFront>
    <div class="frontoffice-dashboard">
      <div class="stats-overview">
        <div class="small-stat">
          <span class="stat-icon">👥</span>
          <div class="stat-info">
            <span class="stat-value">{{ clients.length }}</span>
            <span class="stat-label">Clients Actifs</span>
          </div>
        </div>
        <div class="small-stat">
          <span class="stat-icon">🔧</span>
          <div class="stat-info">
            <span class="stat-value">{{ activeRepairs.filter(r => r.status !== 'Terminé').length }}</span>
            <span class="stat-label">Réparations en cours</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Active Repairs Section -->
        <section class="dashboard-card repairs-section">
          <h3>🔧 Réparations en cours</h3>
          <div class="card-content">
            <table class="front-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Statut</th>
                  <th>Progression</th>
                  <th>Délai estimé</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="repair in activeRepairs" :key="repair.id">
                  <td><strong>{{ repair.client }}</strong></td>
                  <td>
                    <span :class="['status-badge', getStatusClass(repair.status)]">
                      {{ repair.status }}
                    </span>
                  </td>
                  <td>
                    <div class="progress-bar-container">
                      <div class="progress-bar" :style="{ width: repair.progress + '%' }"></div>
                      <span class="progress-text">{{ repair.progress }}%</span>
                    </div>
                  </td>
                  <td>{{ repair.estimation }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Clients Section -->
        <section class="dashboard-card clients-section">
          <h3>👥 Liste des clients</h3>
          <div class="card-content">
            <div v-for="client in clients" :key="client.id" class="client-item">
              <div class="client-avatar">{{ client.name[0] }}</div>
              <div class="client-details">
                <span class="client-name">{{ client.name }}</span>
                <span class="client-sub">{{ client.car }}</span>
              </div>
              <div class="client-contact">
                {{ client.phone }}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </LayoutFront>
</template>

<style scoped>
.frontoffice-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.small-stat {
  background: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 1.5rem;
  padding: 0.75rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  font-size: 0.8125rem;
  color: #64748b;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.dashboard-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.dashboard-card h3 {
  padding: 1.25rem 1.5rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.card-content {
  padding: 1rem;
}

.front-table {
  width: 100%;
  border-collapse: collapse;
}

.front-table th {
  text-align: left;
  padding: 0.75rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 600;
}

.front-table td {
  padding: 1rem 0.75rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #f8fafc;
}

.status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-ongoing { background: #dcfce7; color: #15803d; }
.status-pending { background: #fef9c3; color: #a16207; }
.status-completed { background: #f1f5f9; color: #475569; }

.progress-bar-container {
  width: 120px;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
}

.progress-text {
  font-size: 0.7rem;
  margin-top: 4px;
  display: inline-block;
  color: #64748b;
}

.client-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  gap: 1rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.client-item:hover {
  background: #f8fafc;
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

.client-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.client-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1e293b;
}

.client-sub {
  font-size: 0.75rem;
  color: #64748b;
}

.client-contact {
  font-size: 0.75rem;
  color: #3b82f6;
  font-weight: 500;
}
</style>
