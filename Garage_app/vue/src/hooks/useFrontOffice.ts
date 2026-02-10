import { ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

export interface Client {
    id: string
    name: string
    email: string
}

export interface Repair {
    id: string
    client: string
    intervention: string
    status: string
    progress: number
    estimation: string
}

export function useFrontOffice() {
    const clients = ref<Client[]>([])
    const activeRepairs = ref<Repair[]>([])
    const loading = ref(true)

    const fetchData = async () => {
        loading.value = true
        try {
            const response = await axios.get(`${API_BASE_URL}/api/front-office`)
            clients.value = response.data.clients
            activeRepairs.value = response.data.activeRepairs
        } catch (error) {
            console.error('Erreur lors de la récupération des données Front Office:', error)
        } finally {
            loading.value = false
        }
    }

    return {
        clients,
        activeRepairs,
        loading,
        fetchData
    }
}
