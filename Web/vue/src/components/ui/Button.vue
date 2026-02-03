<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  type: 'button',
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-full-width': fullWidth },
      { 'btn-disabled': disabled }
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;
  text-decoration: none;
  outline: none;
}

.btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Sizes */
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
}

.btn-md {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  line-height: 1.5rem;
}

/* Variants */
.btn-default {
  background-color: #f3f4f6;
  color: #1f2937;
  border-color: #d1d5db;
}

.btn-default:hover:not(.btn-disabled) {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.btn-default:active:not(.btn-disabled) {
  background-color: #d1d5db;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-primary:hover:not(.btn-disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-primary:active:not(.btn-disabled) {
  transform: translateY(0);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  border: none;
}

.btn-secondary:hover:not(.btn-disabled) {
  background-color: #4b5563;
}

.btn-secondary:active:not(.btn-disabled) {
  background-color: #374151;
}

.btn-destructive {
  background-color: #ef4444;
  color: white;
  border: none;
}

.btn-destructive:hover:not(.btn-disabled) {
  background-color: #dc2626;
}

.btn-destructive:active:not(.btn-disabled) {
  background-color: #b91c1c;
}

.btn-outline {
  background-color: transparent;
  color: #1f2937;
  border-color: #d1d5db;
}

.btn-outline:hover:not(.btn-disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-outline:active:not(.btn-disabled) {
  background-color: #e5e7eb;
}

.btn-ghost {
  background-color: transparent;
  color: #1f2937;
  border: none;
}

.btn-ghost:hover:not(.btn-disabled) {
  background-color: #f3f4f6;
}

.btn-ghost:active:not(.btn-disabled) {
  background-color: #e5e7eb;
}

/* States */
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-full-width {
  width: 100%;
}
</style>
