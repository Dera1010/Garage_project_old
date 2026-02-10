<script setup lang="ts">
import { provide, reactive } from 'vue'

interface FormContext {
  errors: Record<string, string>
}

const formContext = reactive<FormContext>({
  errors: {}
})

provide('formContext', formContext)

const emit = defineEmits<{
  submit: [event: Event]
}>()

const handleSubmit = (event: Event) => {
  event.preventDefault()
  emit('submit', event)
}
</script>

<template>
  <form @submit="handleSubmit">
    <slot />
  </form>
</template>
