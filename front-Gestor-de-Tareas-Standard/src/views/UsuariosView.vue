<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Usuarios</h1>
        <p class="page-sub">{{ usuariosStore.usuarios.length }} miembros del equipo</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Nuevo usuario</button>
    </div>

    <div class="loading-wrap" v-if="usuariosStore.loading">
      <div class="loader"></div>
    </div>

    <div class="table-wrap" v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Tareas asignadas</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usuariosStore.usuarios" :key="u.id">
            <td>
              <div class="user-cell">
                <div class="avatar" :style="{ background: getAvatarColor(u.nombre) }">
                  {{ u.nombre.charAt(0).toUpperCase() }}
                </div>
                <span class="user-name">{{ u.nombre }}</span>
              </div>
            </td>
            <td class="text-muted">{{ u.email }}</td>
            <td>
              <span class="role-badge" :class="u.role">{{ u.role }}</span>
            </td>
            <td>
              <span class="tasks-count">
                {{ tareasStore.tareas.filter((t) => t.assignedTo?.id === u.id).length }} tareas
              </span>
            </td>
            <td>
              <div class="row-actions">
                <button class="action-btn edit" @click="openEdit(u)" title="Editar">✎</button>
                <button class="action-btn delete" @click="confirmDelete(u)" title="Eliminar">
                  ✕
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="empty-state" v-if="!usuariosStore.usuarios.length">Sin usuarios</div>
    </div>

    <!-- Modal -->
    <AppModal v-model="showModal" :title="editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'">
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="field">
          <label>Nombre *</label>
          <input v-model="form.nombre" required placeholder="Nombre completo" />
        </div>
        <div class="field">
          <label>Email *</label>
          <input v-model="form.email" type="email" required placeholder="correo@email.com" />
        </div>
        <div class="form-row">
          <div class="field">
            <label>Contraseña {{ editingUsuario ? '(dejar vacío para mantener)' : '*' }}</label>
            <input
              v-model="form.password"
              type="password"
              :required="!editingUsuario"
              placeholder="••••••••"
            />
          </div>
          <div class="field">
            <label>Rol *</label>
            <select v-model="form.role" required>
              <option value="">Seleccionar</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="showModal = false">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="formLoading">
            {{ formLoading ? 'Guardando...' : editingUsuario ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal v-model="showDeleteModal" title="Eliminar usuario">
      <p class="confirm-text">
        ¿Eliminar al usuario "<strong>{{ deletingUsuario?.nombre }}</strong
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
import { useUsuariosStore } from '@/stores/usuariosStore'
import { useTareasStore } from '@/stores/tareaStore'
import AppModal from '@/components/AppModal.vue'
import type { Usuario } from '@/types'

const usuariosStore = useUsuariosStore()
const tareasStore = useTareasStore()

const showModal = ref(false)
const showDeleteModal = ref(false)
const editingUsuario = ref<Usuario | null>(null)
const deletingUsuario = ref<Usuario | null>(null)
const formLoading = ref(false)
const formError = ref('')
const form = ref({ nombre: '', email: '', password: '', role: '' })

const AVATAR_COLORS = ['#f5a623', '#4e9af5', '#52c97e', '#e05252', '#a78bfa', '#fb7185']
function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

function openCreate() {
  editingUsuario.value = null
  form.value = { nombre: '', email: '', password: '', role: '' }
  formError.value = ''
  showModal.value = true
}

function openEdit(u: Usuario) {
  editingUsuario.value = u
  form.value = { nombre: u.nombre, email: u.email, password: '', role: u.role }
  formError.value = ''
  showModal.value = true
}

function confirmDelete(u: Usuario) {
  deletingUsuario.value = u
  showDeleteModal.value = true
}

async function handleSubmit() {
  formLoading.value = true
  formError.value = ''
  try {
    const payload: any = {
      nombre: form.value.nombre,
      email: form.value.email,
      role: form.value.role,
    }
    if (form.value.password) payload.password = form.value.password
    if (editingUsuario.value) {
      await usuariosStore.update(editingUsuario.value.id, payload)
    } else {
      await usuariosStore.create(payload)
    }
    showModal.value = false
  } catch (e: any) {
    formError.value = e.message || 'Error al guardar'
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!deletingUsuario.value) return
  formLoading.value = true
  try {
    await usuariosStore.remove(deletingUsuario.value.id)
    showDeleteModal.value = false
  } finally {
    formLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([usuariosStore.fetchAll(), tareasStore.fetchAll()])
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

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #0d0d0f;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
  color: #e0e0d8;
}

.text-muted {
  color: #555;
  font-size: 13px;
}

.role-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}
.role-badge.admin {
  background: rgba(245, 166, 35, 0.1);
  color: #f5a623;
}
.role-badge.user {
  background: rgba(78, 154, 245, 0.1);
  color: #4e9af5;
}

.tasks-count {
  font-size: 13px;
  color: #888;
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
}
.field input:focus,
.field select:focus {
  border-color: #f5a623;
}
.field input::placeholder {
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
