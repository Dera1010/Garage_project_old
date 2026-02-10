import { ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

export interface Client {
    id: string
    name: string
    email: string
}


export function useListClient() {
    const clients = ref<Client[]>([])
    const loading = ref(true)

    const fetchData = async () => {
        loading.value = true
        try {
            const response = await axios.get(`${API_BASE_URL}/api/list-client`)
            clients.value = response.data.clients
        } catch (error) {
            console.error('Erreur lors de la récupération des données Front Office:', error)
        } finally {
            loading.value = false
        }
    }

    return {
        clients,
        loading,
        fetchData
    }
}
