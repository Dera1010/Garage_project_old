<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  type?: string
  placeholder?: string
  disabled?: boolean
  modelValue?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const formItem = inject<any>('formItem', null)

const hasError = computed(() => formItem?.error?.value || formItem?.error)
const controlId = computed(() => formItem?.formItemId?.value || formItem?.formItemId)
const descriptionId = computed(() => formItem?.formDescriptionId?.value || formItem?.formDescriptionId)
const messageId = computed(() => formItem?.formMessageId?.value || formItem?.formMessageId)

const ariaDescribedBy = computed(() => {
  if (!hasError.value) {
    return descriptionId.value
  }
  return `${descriptionId.value} ${messageId.value}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :id="controlId"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :aria-describedby="ariaDescribedBy"
    :aria-invalid="!!hasError"
    :class="['form-control', { 'has-error': hasError }]"
    @input="handleInput"
  />
</template>

<style scoped>
.form-control {
  width: 92%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #1f2937;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;
  margin-right: 10px;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-control.has-error {
  border-color: #ef4444;
}

.form-control.has-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
