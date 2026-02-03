<script setup lang="ts">
import { ref } from 'vue'
import Form from '../components/ui/Form.vue'
import FormItem from '../components/ui/FormItem.vue'
import FormLabel from '../components/ui/FormLabel.vue'
import FormControl from '../components/ui/FormControl.vue'
import FormMessage from '../components/ui/FormMessage.vue'
import Button from '../components/ui/Button.vue'
import { useRouter } from 'vue-router'

// Form data
const name = ref('')
const mdp = ref('')

const router = useRouter()

// Errors
const nameError = ref('')
const mdpError = ref('')

// Emit
const emit = defineEmits<{
  login: []
}>()

// Form submission
const handleSubmit = () => {
  // Reset errors
  nameError.value = ''
  mdpError.value = ''

  // Validation
  if (!name.value) {
    nameError.value = 'Le nom est requis'
    return
  }
  if (!mdp.value) {
    mdpError.value = 'Le mot de passe est requis'
    return
  }

  // Check credentials
  if (name.value === 'admin' && mdp.value === 'admin') {
    // Success - emit login event
    emit('login')
    router.push('/dashboard')
  } else {
    // Invalid credentials
    nameError.value = 'Identifiants incorrects'
    mdpError.value = 'Identifiants incorrects'
  }
}
</script>

<template>
    <div class="login-card">
      <h2>Login backoffice</h2>
      
      <Form @submit="handleSubmit">
        <FormItem name="name" :error="nameError">
          <FormLabel required>Nom</FormLabel>
          <FormControl
            v-model="name"
            type="text"
            placeholder="Entrez votre nom"
          />
          <FormMessage />
        </FormItem>

        <FormItem name="mdp" :error="mdpError">
          <FormLabel required>Mot de passe</FormLabel>
          <FormControl
            v-model="mdp"
            type="password"
            placeholder="Entrez votre mot de passe"
          />
          <FormMessage />
        </FormItem>

        <Button type="submit" variant="primary" fullWidth>
          Se connecter
        </Button>
      </Form>
    </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: none;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  justify-content: center;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

h2 {
  color: #1f2937;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

</style>
