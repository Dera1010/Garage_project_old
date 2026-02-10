<script setup lang="ts">
import { provide, computed } from 'vue'

interface Props {
  name: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  error: ''
})

const formItemId = computed(() => `${props.name}-form-item`)
const formDescriptionId = computed(() => `${props.name}-form-item-description`)
const formMessageId = computed(() => `${props.name}-form-item-message`)

provide('formItem', {
  name: props.name,
  error: props.error,
  formItemId,
  formDescriptionId,
  formMessageId
})
</script>

<template>
  <div class="form-item">
    <slot />
  </div>
</template>

<style scoped>
.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
