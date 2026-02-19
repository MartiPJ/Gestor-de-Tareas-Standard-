<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Catálogo de Estados</h1>
        <p class="page-sub">{{ catalogoStore.catalogos.length }} estados configurados</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Nuevo estado</button>
    </div>

    <div class="loading-wrap" v-if="catalogoStore.loading">
      <div class="loader"></div>
    </div>

    <div class="catalog-grid" v-else>
      <div class="catalog-card" v-for="c in catalogoStore.catalogos" :key="c.id">
        <div class="catalog-dot" :style="{ background: getStatusColor(c.Estado) }"></div>
        <div class="catalog-info">
          <span class="catalog-name">{{ c.Estado }}</span>
          <span class="catalog-count">
            {{ tareasStore.tareas.filter((t) => t.catalogo?.id === c.id).length }} tareas con este
            estado
          </span>
        </div>
        <div class="catalog-actions">
          <button class="action-btn edit" @click="openEdit(c)">✎</button>
          <button class="action-btn delete" @click="confirmDelete(c)">✕</button>
        </div>
      </div>

      <div class="empty-state" v-if="!catalogoStore.catalogos.length">Sin estados configurados</div>
    </div>

    <!-- Modal -->
    <AppModal v-model="showModal" :title="editingCatalogo ? 'Editar Estado' : 'Nuevo Estado'">
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="field">
          <label>Nombre del estado *</label>
          <input v-model="form.Estado" required placeholder="Ej: En revisión" />
        </div>
        <div class="preview" v-if="form.Estado">
          <span class="preview-label">Vista previa:</span>
          <span
            class="status-badge"
            :style="{
              color: getStatusColor(form.Estado),
              borderColor: getStatusColor(form.Estado) + '33',
              background: getStatusColor(form.Estado) + '12',
            }"
            >{{ form.Estado }}</span
          >
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="showModal = false">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="formLoading">
            {{ formLoading ? 'Guardando...' : editingCatalogo ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal v-model="showDeleteModal" title="Eliminar estado">
      <p class="confirm-text">
        ¿Eliminar el estado "<strong>{{ deletingCatalogo?.Estado }}</strong
        >"?
      </p>
      <div class="form-actions" style="margin-top: 20px">
        <button class="btn-secondary" @click="showDeleteModal = false">Cancelar</button>
        <button class="btn-danger" @click="handleDelete" :disabled="formLoading">
          {{ formLoading ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCatalogoStore } from '@/stores/catalogoStore'
import { useTareasStore } from '@/stores/tareaStore'
import AppModal from '@/components/AppModal.vue'
import type { Catalogo } from '@/types'

const catalogoStore = useCatalogoStore()
const tareasStore = useTareasStore()

const showModal = ref(false)
const showDeleteModal = ref(false)
const editingCatalogo = ref<Catalogo | null>(null)
const deletingCatalogo = ref<Catalogo | null>(null)
const formLoading = ref(false)
const formError = ref('')
const form = ref({ Estado: '' })

const STATUS_COLORS: Record<string, string> = {
  pendiente: '#f5a623',
  'en progreso': '#4e9af5',
  completado: '#52c97e',
  bloqueado: '#e05252',
}

function getStatusColor(estado: string) {
  return STATUS_COLORS[estado.toLowerCase()] ?? '#888'
}

function openCreate() {
  editingCatalogo.value = null
  form.value = { Estado: '' }
  formError.value = ''
  showModal.value = true
}

function openEdit(c: Catalogo) {
  editingCatalogo.value = c
  form.value = { Estado: c.Estado }
  formError.value = ''
  showModal.value = true
}

function confirmDelete(c: Catalogo) {
  deletingCatalogo.value = c
  showDeleteModal.value = true
}

async function handleSubmit() {
  formLoading.value = true
  formError.value = ''
  try {
    if (editingCatalogo.value) {
      await catalogoStore.update(editingCatalogo.value.id, form.value)
    } else {
      await catalogoStore.create(form.value)
    }
    showModal.value = false
  } catch (e: any) {
    formError.value = e.message || 'Error al guardar'
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!deletingCatalogo.value) return
  formLoading.value = true
  try {
    await catalogoStore.remove(deletingCatalogo.value.id)
    showDeleteModal.value = false
  } finally {
    formLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([catalogoStore.fetchAll(), tareasStore.fetchAll()])
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

* {
  box-sizing: border-box;
}

.page {
  padding: 32px;
  font-family: 'DM Sans', sans-serif;
  color: #e8e8e0;
  background: #0d0d0f;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.page-title {
  font-family: 'Space Mono', monospace;
  font-size: 26px;
  font-weight: 700;
  color: #f0ede8;
}
.page-sub {
  font-size: 13px;
  color: #555;
  margin-top: 4px;
}

.btn-primary {
  background: #f5a623;
  color: #0d0d0f;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-primary:hover:not(:disabled) {
  background: #e89910;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: none;
  border: 1px solid #2a2a34;
  color: #888;
  border-radius: 10px;
  padding: 10px 20px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-secondary:hover {
  border-color: #444;
  color: #ccc;
}

.btn-danger {
  background: rgba(224, 82, 82, 0.15);
  border: 1px solid rgba(224, 82, 82, 0.4);
  color: #e05252;
  border-radius: 10px;
  padding: 10px 20px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-danger:hover:not(:disabled) {
  background: rgba(224, 82, 82, 0.25);
}
.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 60px;
}
.loader {
  width: 28px;
  height: 28px;
  border: 2px solid #2a2a34;
  border-top-color: #f5a623;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.catalog-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 600px;
}

.catalog-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #111114;
  border: 1px solid #1e1e24;
  border-radius: 12px;
  padding: 16px 18px;
  transition: border-color 0.15s;
}
.catalog-card:hover {
  border-color: #2a2a34;
}

.catalog-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.catalog-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.catalog-name {
  font-weight: 600;
  font-size: 15px;
  color: #e0e0d8;
  text-transform: capitalize;
}

.catalog-count {
  font-size: 12px;
  color: #555;
}

.catalog-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.15s;
}
.catalog-card:hover .catalog-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #2a2a34;
  border-radius: 6px;
  background: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.action-btn.edit {
  color: #888;
}
.action-btn.edit:hover {
  border-color: #f5a623;
  color: #f5a623;
}
.action-btn.delete {
  color: #555;
}
.action-btn.delete:hover {
  border-color: #e05252;
  color: #e05252;
}

.empty-state {
  text-align: center;
  padding: 50px;
  color: #444;
  font-size: 14px;
  background: #111114;
  border: 1px dashed #2a2a34;
  border-radius: 12px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.field input {
  background: #0d0d0f;
  border: 1px solid #2a2a34;
  border-radius: 8px;
  padding: 10px 12px;
  color: #e8e8e0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}
.field input:focus {
  border-color: #f5a623;
}
.field input::placeholder {
  color: #3a3a44;
}

.preview {
  display: flex;
  align-items: center;
  gap: 10px;
}
.preview-label {
  font-size: 12px;
  color: #555;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;
  text-transform: capitalize;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.form-error {
  font-size: 13px;
  color: #e05252;
  background: rgba(224, 82, 82, 0.08);
  border: 1px solid rgba(224, 82, 82, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
}

.confirm-text {
  font-size: 14px;
  color: #aaa;
  line-height: 1.5;
}
.confirm-text strong {
  color: #e0e0d8;
}
</style>
