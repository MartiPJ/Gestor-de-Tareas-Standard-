<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Proyectos</h1>
        <p class="page-sub">{{ proyectosStore.proyectos.length }} proyectos activos</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Nuevo proyecto</button>
    </div>

    <div class="loading-wrap" v-if="proyectosStore.loading">
      <div class="loader"></div>
    </div>

    <div class="projects-grid" v-else>
      <div class="project-card" v-for="p in proyectosStore.proyectos" :key="p.id">
        <div class="project-top">
          <div class="project-icon">⬡</div>
          <div class="project-actions">
            <button class="action-btn edit" @click="openEdit(p)">✎</button>
            <button class="action-btn delete" @click="confirmDelete(p)">✕</button>
          </div>
        </div>
        <h3 class="project-name">{{ p.nombre }}</h3>
        <p class="project-desc">{{ p.descripcion }}</p>
        <div class="project-footer">
          <span class="project-tasks">
            {{ tareasStore.tareas.filter((t) => t.proyecto?.id === p.id).length }} tareas
          </span>
          <span class="project-date">{{ formatDate(p.create_at) }}</span>
        </div>
      </div>

      <div class="empty-card" v-if="!proyectosStore.proyectos.length">Sin proyectos aún</div>
    </div>

    <!-- Modal -->
    <AppModal v-model="showModal" :title="editingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'">
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="field">
          <label>Nombre *</label>
          <input v-model="form.nombre" required placeholder="Nombre del proyecto" />
        </div>
        <div class="field">
          <label>Descripción</label>
          <textarea v-model="form.descripcion" rows="3" placeholder="Descripción..."></textarea>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="showModal = false">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="formLoading">
            {{ formLoading ? 'Guardando...' : editingProyecto ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal v-model="showDeleteModal" title="Eliminar proyecto">
      <p class="confirm-text">
        ¿Eliminar "<strong>{{ deletingProyecto?.nombre }}</strong
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
import { useProyectosStore } from '@/stores/proyectosStore'
import { useTareasStore } from '@/stores/tareaStore'
import AppModal from '@/components/AppModal.vue'
import type { Proyecto } from '@/types'

const proyectosStore = useProyectosStore()
const tareasStore = useTareasStore()

const showModal = ref(false)
const showDeleteModal = ref(false)
const editingProyecto = ref<Proyecto | null>(null)
const deletingProyecto = ref<Proyecto | null>(null)
const formLoading = ref(false)
const formError = ref('')
const form = ref({ nombre: '', descripcion: '' })

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function openCreate() {
  editingProyecto.value = null
  form.value = { nombre: '', descripcion: '' }
  formError.value = ''
  showModal.value = true
}

function openEdit(p: Proyecto) {
  editingProyecto.value = p
  form.value = { nombre: p.nombre, descripcion: p.descripcion }
  formError.value = ''
  showModal.value = true
}

function confirmDelete(p: Proyecto) {
  deletingProyecto.value = p
  showDeleteModal.value = true
}

async function handleSubmit() {
  formLoading.value = true
  formError.value = ''
  try {
    if (editingProyecto.value) {
      await proyectosStore.update(editingProyecto.value.id, form.value)
    } else {
      await proyectosStore.create(form.value)
    }
    showModal.value = false
  } catch (e: any) {
    formError.value = e.message || 'Error al guardar'
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!deletingProyecto.value) return
  formLoading.value = true
  try {
    await proyectosStore.remove(deletingProyecto.value.id)
    showDeleteModal.value = false
  } finally {
    formLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([proyectosStore.fetchAll(), tareasStore.fetchAll()])
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
  white-space: nowrap;
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.project-card {
  background: #111114;
  border: 1px solid #1e1e24;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition:
    border-color 0.15s,
    transform 0.15s;
}
.project-card:hover {
  border-color: #2a2a34;
  transform: translateY(-2px);
}

.project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-icon {
  font-size: 24px;
  color: #4e9af5;
}

.project-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.15s;
}
.project-card:hover .project-actions {
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

.project-name {
  font-family: 'Space Mono', monospace;
  font-size: 15px;
  font-weight: 700;
  color: #f0ede8;
}

.project-desc {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  flex: 1;
}

.project-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #1e1e24;
}

.project-tasks {
  font-size: 12px;
  color: #f5a623;
  font-weight: 600;
}

.project-date {
  font-size: 11px;
  color: #444;
}

.empty-card {
  text-align: center;
  padding: 60px;
  color: #444;
  font-size: 14px;
  background: #111114;
  border: 1px dashed #2a2a34;
  border-radius: 14px;
  grid-column: 1 / -1;
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
.field input,
.field textarea {
  background: #0d0d0f;
  border: 1px solid #2a2a34;
  border-radius: 8px;
  padding: 10px 12px;
  color: #e8e8e0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  resize: none;
}
.field input:focus,
.field textarea:focus {
  border-color: #f5a623;
}
.field input::placeholder,
.field textarea::placeholder {
  color: #3a3a44;
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
