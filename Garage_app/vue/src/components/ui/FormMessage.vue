<script setup lang="ts">
import { inject, computed } from 'vue'

const formItem = inject<any>('formItem', null)

const messageId = computed(() => formItem?.formMessageId?.value || formItem?.formMessageId)
const error = computed(() => formItem?.error?.value || formItem?.error)
</script>

<template>
  <p v-if="error" :id="messageId" class="form-message">
    {{ error }}
  </p>
</template>

<style scoped>
.form-message {
  font-size: 0.75rem;
  font-weight: 500;
  color: #ef4444;
  margin: 0;
}
</style>
