<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import Layout from '../components/Layout.vue'
import Toast from '../components/ui/Toast.vue'
import Form from '../components/ui/Form.vue'
import FormItem from '../components/ui/FormItem.vue'
import FormLabel from '../components/ui/FormLabel.vue'
import FormControl from '../components/ui/FormControl.vue'
import FormMessage from '../components/ui/FormMessage.vue'
import Button from '../components/ui/Button.vue'

const emit = defineEmits<{
  logout: []
}>()

// Form data
const intervention = ref('')
const prix = ref('')
const duree = ref('')

// Errors
const interventionError = ref('')
const prixError = ref('')
const dureeError = ref('')

// Toast state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const triggerToast = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

// Form submission
const handleSubmit = async () => {
  // Reset errors
  interventionError.value = ''
  prixError.value = ''
  dureeError.value = ''

  // Validation
  if (!intervention.value) {
    interventionError.value = 'L\'intervention est requise'
    return
  }
  if (!prix.value) {
    prixError.value = 'Le prix est requis'
    return
  }
  if (!duree.value) {
    dureeError.value = 'La durée est requise'
    return
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/interventions`, {
      nom: intervention.value,
      prix: parseFloat(prix.value),
      time: parseInt(duree.value)
    })

    console.log('Success:', response.data)
    triggerToast('Élément ajouté avec succès!', 'success')
    
    // Reset form
    intervention.value = ''
    prix.value = ''
    duree.value = ''
  } catch (error: any) {
    console.error('Error submitting form:', error)
    
    if (error.response && error.response.status === 422) {
      const errors = error.response.data.errors
      if (errors.nom) {
        interventionError.value = errors.nom[0]
        // If it's a unique constraint error, show a dedicated toast
        if (errors.nom[0].includes('already been taken') || errors.nom[0].includes('déjà utilisé')) {
          triggerToast('Cette intervention existe déjà dans la base de données.', 'error')
        }
      }
      if (errors.prix) prixError.value = errors.prix[0]
      if (errors.time) dureeError.value = errors.time[0]
    } else {
      triggerToast('Une erreur est survenue lors de l\'ajout de l\'intervention.', 'error')
    }
  }
}


const handleLogout = () => {
  emit('logout')
}

</script>

<template>
  <Layout @logout="handleLogout">
    <Toast 
      v-if="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      @close="showToast = false" 
    />
    <div class="element-container">
      <div class="form-card">
        <h2>Ajouter un élément</h2>
        
        <Form @submit="handleSubmit">
          <FormItem name="intervention" :error="interventionError">
            <FormLabel required>Intervention</FormLabel>
            <FormControl
              v-model="intervention"
              type="text"
              placeholder="Nom de l'intervention"
            />
            <FormMessage />
          </FormItem>

          <FormItem name="prix" :error="prixError">
            <FormLabel required>Prix</FormLabel>
            <FormControl
              v-model="prix"
              type="number"
              placeholder="0.00"
            />
            <FormMessage />
          </FormItem>

          <FormItem name="duree" :error="dureeError">
            <FormLabel required>Durée</FormLabel>
            <FormControl
              v-model="duree"
              type="number"
              placeholder="30"
            />
            <FormMessage />
          </FormItem>

          <div class="button-group">
            <Button type="submit" variant="primary">
              Ajouter
            </Button>
            <Button type="button" variant="outline" @click="() => { intervention = ''; prix = ''; duree = '' }">
              Réinitialiser
            </Button>
          </div>
        </Form>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.element-container {
  max-width: 600px;
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.form-card h2 {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.button-group button {
  flex: 1;
}
</style>
