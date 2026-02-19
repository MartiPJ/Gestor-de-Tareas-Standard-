<template>
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Tareas</h1>
        <p class="page-sub">
          {{ filteredTareas.length }} de {{ tareasStore.tareas.length }} tareas
        </p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Nueva tarea</button>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <input v-model="search" class="search-input" placeholder="Buscar tarea..." />
      <select v-model="filterUser" class="select-filter">
        <option value="">Todos los usuarios</option>
        <option v-for="u in usuariosStore.usuarios" :key="u.id" :value="u.id">
          {{ u.nombre }}
        </option>
      </select>
      <select v-model="filterProject" class="select-filter">
        <option value="">Todos los proyectos</option>
        <option v-for="p in proyectosStore.proyectos" :key="p.id" :value="p.id">
          {{ p.nombre }}
        </option>
      </select>
      <select v-model="filterStatus" class="select-filter">
        <option value="">Todos los estados</option>
        <option v-for="c in catalogoStore.catalogos" :key="c.id" :value="c.id">
          {{ c.Estado }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div class="loading-wrap" v-if="tareasStore.loading">
      <div class="loader"></div>
    </div>

    <!-- Table -->
    <div class="table-wrap" v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Proyecto</th>
            <th>Asignado a</th>
            <th>Estado</th>
            <th>Creado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filteredTareas" :key="t.id">
            <td>
              <div class="cell-title">{{ t.titulo }}</div>
              <div class="cell-desc">{{ t.descripcion }}</div>
            </td>
            <td>
              <span class="chip chip-project">{{ t.proyecto?.nombre }}</span>
            </td>
            <td>
              <div class="user-cell">
                <div class="avatar-sm">{{ t.assignedTo?.nombre?.charAt(0) }}</div>
                {{ t.assignedTo?.nombre }}
              </div>
            </td>
            <td>
              <span
                class="status-badge"
                :style="{
                  color: getStatusColor(t.catalogo?.Estado),
                  borderColor: getStatusColor(t.catalogo?.Estado) + '33',
                  background: getStatusColor(t.catalogo?.Estado) + '12',
                }"
              >
                {{ t.catalogo?.Estado }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(t.createdAt) }}</td>
            <td>
              <div class="row-actions">
                <button class="action-btn edit" @click="openEdit(t)" title="Editar">✎</button>
                <button class="action-btn delete" @click="confirmDelete(t)" title="Eliminar">
                  ✕
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="empty-state" v-if="!filteredTareas.length">Sin resultados</div>
    </div>

    <!-- Create/Edit Modal -->
    <AppModal v-model="showModal" :title="editingTarea ? 'Editar Tarea' : 'Nueva Tarea'">
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="field">
          <label>Título *</label>
          <input v-model="form.titulo" required placeholder="Nombre de la tarea" />
        </div>
        <div class="field">
          <label>Descripción</label>
          <textarea v-model="form.descripcion" placeholder="Descripción..." rows="3"></textarea>
        </div>
        <div class="field">
          <label>Proyecto *</label>
          <select v-model="form.proyectoId" required>
            <option value="">Seleccionar proyecto</option>
            <option v-for="p in proyectosStore.proyectos" :key="p.id" :value="p.id">
              {{ p.nombre }}
            </option>
          </select>
        </div>
        <div class="form-row">
          <div class="field">
            <label>Asignar a *</label>
            <select v-model="form.assignedToId" required>
              <option value="">Seleccionar usuario</option>
              <option v-for="u in usuariosStore.usuarios" :key="u.id" :value="u.id">
                {{ u.nombre }}
              </option>
            </select>
          </div>
          <div class="field">
            <label>Estado *</label>
            <select v-model="form.catalogoId" required>
              <option value="">Seleccionar estado</option>
              <option v-for="c in catalogoStore.catalogos" :key="c.id" :value="c.id">
                {{ c.Estado }}
              </option>
            </select>
          </div>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="showModal = false">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="formLoading">
            {{ formLoading ? 'Guardando...' : editingTarea ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </AppModal>

    <!-- Delete Confirm Modal -->
    <AppModal v-model="showDeleteModal" title="Eliminar tarea">
      <p class="confirm-text">
        ¿Eliminar "<strong>{{ deletingTarea?.titulo }}</strong
        >"? Esta acción no se puede deshacer.
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
import { ref, computed, onMounted } from 'vue'
import { useTareasStore } from '@/stores/tareaStore'
import { useProyectosStore } from '@/stores/proyectosStore'
import { useUsuariosStore } from '@/stores/usuariosStore'
import { useCatalogoStore } from '@/stores/catalogoStore'
import { useAuthStore } from '@/stores/authStore'
import AppModal from '@/components/AppModal.vue'
import type { Tarea } from '@/types'

const tareasStore = useTareasStore()
const proyectosStore = useProyectosStore()
const usuariosStore = useUsuariosStore()
const catalogoStore = useCatalogoStore()
const auth = useAuthStore()

const search = ref('')
const filterUser = ref('')
const filterProject = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingTarea = ref<Tarea | null>(null)
const deletingTarea = ref<Tarea | null>(null)
const formLoading = ref(false)
const formError = ref('')

const emptyForm = () => ({
  titulo: '',
  descripcion: '',
  proyectoId: '',
  assignedToId: '',
  catalogoId: '',
  createdById: auth.user?.id || '',
})

const form = ref(emptyForm())

const STATUS_COLORS: Record<string, string> = {
  pendiente: '#f5a623',
  'en progreso': '#4e9af5',
  completado: '#52c97e',
  bloqueado: '#e05252',
}

function getStatusColor(estado?: string) {
  if (!estado) return '#555'
  return STATUS_COLORS[estado.toLowerCase()] ?? '#888'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const filteredTareas = computed(() => {
  return tareasStore.tareas.filter((t) => {
    const matchSearch = !search.value || t.titulo.toLowerCase().includes(search.value.toLowerCase())
    const matchUser = !filterUser.value || t.assignedTo?.id === filterUser.value
    const matchProject = !filterProject.value || t.proyecto?.id === filterProject.value
    const matchStatus = !filterStatus.value || t.catalogo?.id === filterStatus.value
    return matchSearch && matchUser && matchProject && matchStatus
  })
})

function openCreate() {
  editingTarea.value = null
  form.value = emptyForm()
  formError.value = ''
  showModal.value = true
}

function openEdit(t: Tarea) {
  editingTarea.value = t
  form.value = {
    titulo: t.titulo,
    descripcion: t.descripcion,
    proyectoId: t.proyecto?.id || '',
    assignedToId: t.assignedTo?.id || '',
    catalogoId: t.catalogo?.id || '',
    createdById: t.createdBy?.id || auth.user?.id || '',
  }
  formError.value = ''
  showModal.value = true
}

function confirmDelete(t: Tarea) {
  deletingTarea.value = t
  showDeleteModal.value = true
}

async function handleSubmit() {
  formLoading.value = true
  formError.value = ''
  try {
    if (editingTarea.value) {
      await tareasStore.update(editingTarea.value.id, form.value)
    } else {
      await tareasStore.create(form.value)
    }
    showModal.value = false
  } catch (e: any) {
    formError.value = e.message || 'Error al guardar'
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!deletingTarea.value) return
  formLoading.value = true
  try {
    await tareasStore.remove(deletingTarea.value.id)
    showDeleteModal.value = false
  } catch (e: any) {
    formError.value = e.message
  } finally {
    formLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    tareasStore.fetchAll(),
    proyectosStore.fetchAll(),
    usuariosStore.fetchAll(),
    catalogoStore.fetchAll(),
  ])
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
  margin-bottom: 24px;
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

.filters-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input,
.select-filter {
  background: #111114;
  border: 1px solid #2a2a34;
  border-radius: 10px;
  padding: 9px 14px;
  color: #e8e8e0;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}
.search-input {
  flex: 1;
  min-width: 180px;
}
.search-input::placeholder {
  color: #3a3a44;
}
.search-input:focus,
.select-filter:focus {
  border-color: #f5a623;
}
.select-filter {
  cursor: pointer;
}
.select-filter option {
  background: #111114;
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

.table-wrap {
  background: #111114;
  border: 1px solid #1e1e24;
  border-radius: 14px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  font-size: 11px;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #1e1e24;
  background: #0f0f12;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #16161a;
  font-size: 14px;
  color: #ccc;
  vertical-align: middle;
}

.data-table tr:last-child td {
  border-bottom: none;
}
.data-table tr:hover td {
  background: rgba(255, 255, 255, 0.01);
}

.cell-title {
  font-weight: 500;
  color: #e0e0d8;
}
.cell-desc {
  font-size: 11px;
  color: #555;
  margin-top: 2px;
}

.chip {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}
.chip-project {
  background: rgba(78, 154, 245, 0.1);
  color: #4e9af5;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-sm {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f5a623;
  color: #0d0d0f;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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

.date-cell {
  font-size: 12px;
  color: #555;
  white-space: nowrap;
}

.row-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.15s;
}
.data-table tr:hover .row-actions {
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
}

/* Modal form */
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
.field textarea,
.field select {
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
.field textarea:focus,
.field select:focus {
  border-color: #f5a623;
}
.field input::placeholder,
.field textarea::placeholder {
  color: #3a3a44;
}
.field select option {
  background: #111114;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
