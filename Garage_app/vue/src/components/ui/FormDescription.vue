<script setup lang="ts">
import { inject, computed } from 'vue'

const formItem = inject<any>('formItem', null)

const descriptionId = computed(() => formItem?.formDescriptionId?.value || formItem?.formDescriptionId)
</script>

<template>
  <p :id="descriptionId" class="form-description">
    <slot />
  </p>
</template>

<style scoped>
.form-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
</style>
