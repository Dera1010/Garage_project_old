<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

const formItem = inject<any>('formItem', null)

const hasError = computed(() => formItem?.error?.value || formItem?.error)
const labelFor = computed(() => formItem?.formItemId?.value || formItem?.formItemId)
</script>

<template>
  <label 
    :for="labelFor" 
    :class="['form-label', { 'has-error': hasError }]"
  >
    <slot />
    <span v-if="required" class="required">*</span>
  </label>
</template>

<style scoped>
.form-label {
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.15s ease-in-out;
}

.form-label.has-error {
  color: #ef4444;
}

.required {
  color: #ef4444;
}
</style>
