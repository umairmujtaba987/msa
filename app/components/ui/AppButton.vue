<script setup lang="ts">
defineOptions({ inheritAttrs: true })

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  htmlType?: 'button' | 'submit' | 'reset'
  icon?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  block: false,
  loading: false,
  disabled: false,
  htmlType: 'button',
})
</script>

<template>
  <a-button
    :type="variant === 'primary' ? 'primary' : variant === 'danger' ? 'default' : 'default'"
    :size="size"
    :block="block"
    :loading="loading"
    :disabled="disabled"
    :html-type="htmlType"
    :class="{
      'btn-outline': variant === 'outline',
      'btn-ghost': variant === 'ghost',
      'btn-danger': variant === 'danger',
    }"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
  </a-button>
</template>

<style scoped>
.btn-outline {
  border-color: var(--color-border);
  background: transparent;
}
.btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.btn-ghost {
  background: transparent;
  border: none;
}
.btn-ghost:hover {
  background: var(--color-hover-bg);
}
.btn-danger {
  color: var(--color-danger);
  border-color: var(--color-danger);
}
.btn-danger:hover {
  color: var(--color-danger-hover);
  border-color: var(--color-danger-hover);
}
</style>