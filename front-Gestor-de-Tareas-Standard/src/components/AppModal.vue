<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal-box" :style="{ maxWidth: width }">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="$emit('update:modelValue', false)">✕</button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  width?: string
}>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: #16161a;
  border: 1px solid #2a2a34;
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #1e1e26;
}

.modal-title {
  font-family: 'Space Mono', monospace;
  font-size: 15px;
  font-weight: 700;
  color: #f0ede8;
}

.modal-close {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 14px;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.modal-close:hover {
  background: #2a2a34;
  color: #ccc;
}

.modal-body {
  padding: 20px 24px;
}

.modal-footer {
  padding: 14px 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: translateY(-12px) scale(0.97);
}
</style>
