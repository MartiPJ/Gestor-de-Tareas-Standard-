<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">
          Bienvenido, <strong>{{ auth.user?.nombre }}</strong>
        </p>
      </div>
      <div class="header-date">{{ today }}</div>
    </div>

    <!-- Quick stats (clickeables, navegan a su sección) -->
    <div class="quick-stats">
      <RouterLink v-for="s in quickStats" :key="s.label" :to="s.to" class="qs-card">
        <div class="qs-icon" :style="{ color: s.color }">{{ s.icon }}</div>
        <div class="qs-data">
          <span class="qs-value">{{ s.value }}</span>
          <span class="qs-label">{{ s.label }}</span>
        </div>
        <div class="qs-bar">
          <div class="qs-bar-fill" :style="{ width: s.pct + '%', background: s.color }"></div>
        </div>
        <span class="qs-arrow">→</span>
      </RouterLink>
    </div>

    <!-- Accesos rápidos -->
    <div class="shortcuts">
      <RouterLink v-for="link in shortcutLinks" :key="link.to" :to="link.to" class="shortcut-btn">
        <span class="shortcut-icon">{{ link.icon }}</span>
        {{ link.label }}
      </RouterLink>
    </div>

    <div class="dashboard-grid">
      <!-- Health Monitor -->
      <div class="col-left">
        <HealthMonitor :tareas="tareas" :proyectos="proyectos" />
      </div>

      <!-- Tareas recientes -->
      <div class="col-right">
        <div class="section-header">
          <span class="section-title">Tareas recientes</span>
          <div class="section-actions">
            <button
              class="filter-toggle"
              :class="{ active: filterMine }"
              @click="filterMine = !filterMine"
            >
              {{ filterMine ? '◉ Solo mías' : '◎ Todas' }}
            </button>
            <RouterLink to="/tareas" class="ver-todas">Ver todas →</RouterLink>
          </div>
        </div>

        <div class="loading-wrap" v-if="tareasStore.loading">
          <div class="loader"></div>
        </div>

        <div class="task-list" v-else>
          <TransitionGroup name="task">
            <div class="task-row" v-for="t in filteredTareas" :key="t.id">
              <div
                class="task-status-dot"
                :style="{ background: getStatusColor(t.catalogo?.Estado) }"
              ></div>
              <div class="task-info">
                <span class="task-title">{{ t.titulo }}</span>
                <span class="task-meta">{{ t.proyecto?.nombre }} · {{ t.assignedTo?.nombre }}</span>
              </div>
              <span class="task-badge" :style="{ color: getStatusColor(t.catalogo?.Estado) }">
                {{ t.catalogo?.Estado }}
              </span>
            </div>
          </TransitionGroup>

          <div class="empty-state" v-if="!filteredTareas.length">
            <span>Sin tareas registradas</span>
            <RouterLink to="/tareas" class="empty-link">Crear primera tarea →</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useTareasStore } from '@/stores/tareaStore'
import { useProyectosStore } from '@/stores/proyectosStore'
import HealthMonitor from '@/components/HealthMonitor.vue'

const auth = useAuthStore()
const tareasStore = useTareasStore()
const proyectosStore = useProyectosStore()
const filterMine = ref(false)

const tareas = computed(() => tareasStore.tareas)
const proyectos = computed(() => proyectosStore.proyectos)

const today = computed(() => {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
})

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

const quickStats = computed(() => {
  const total = tareas.value.length
  const completadas = tareas.value.filter(
    (t) => t.catalogo?.Estado?.toLowerCase() === 'completado',
  ).length
  const pendientes = tareas.value.filter(
    (t) => t.catalogo?.Estado?.toLowerCase() === 'pendiente',
  ).length
  const proyectosTotal = proyectos.value.length
  return [
    { label: 'Tareas totales', value: total, icon: '☑', color: '#e8e8e0', pct: 100, to: '/tareas' },
    {
      label: 'Completadas',
      value: completadas,
      icon: '✓',
      color: '#52c97e',
      pct: total ? (completadas / total) * 100 : 0,
      to: '/tareas',
    },
    {
      label: 'Pendientes',
      value: pendientes,
      icon: '◷',
      color: '#f5a623',
      pct: total ? (pendientes / total) * 100 : 0,
      to: '/tareas',
    },
    {
      label: 'Proyectos',
      value: proyectosTotal,
      icon: '⬡',
      color: '#4e9af5',
      pct: 100,
      to: '/proyectos',
    },
  ]
})

const shortcutLinks = [
  { to: '/tareas', icon: '☑', label: 'Tareas' },
  { to: '/proyectos', icon: '⬡', label: 'Proyectos' },
  { to: '/usuarios', icon: '◎', label: 'Equipo' },
  { to: '/catalogo', icon: '⊞', label: 'Estados' },
]

const filteredTareas = computed(() => {
  let list = [...tareas.value].slice(0, 8)
  if (filterMine.value && auth.user) {
    list = list.filter((t) => t.assignedTo?.id === auth.user!.id)
  }
  return list
})

onMounted(async () => {
  await Promise.all([tareasStore.fetchAll(), proyectosStore.fetchAll()])
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard {
  padding: 32px;
  font-family: 'DM Sans', sans-serif;
  color: #e8e8e0;
  min-height: 100vh;
  background: #0d0d0f;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
}

.page-title {
  font-family: 'Space Mono', monospace;
  font-size: 26px;
  font-weight: 700;
  color: #f0ede8;
  line-height: 1.2;
}

.page-sub {
  font-size: 14px;
  color: #555;
  margin-top: 4px;
}
.page-sub strong {
  color: #f5a623;
  font-weight: 600;
}

.header-date {
  font-size: 12px;
  color: #444;
  text-align: right;
  text-transform: capitalize;
  padding-top: 4px;
}

/* ── Quick stats ── */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.qs-card {
  background: #111114;
  border: 1px solid #1e1e24;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  transition:
    border-color 0.15s,
    transform 0.15s;
}
.qs-card:hover {
  border-color: #2a2a34;
  transform: translateY(-2px);
}

.qs-icon {
  font-size: 20px;
  line-height: 1;
}

.qs-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.qs-value {
  font-family: 'Space Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  color: #f0ede8;
  line-height: 1;
}

.qs-label {
  font-size: 12px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.qs-bar {
  height: 3px;
  background: #1e1e26;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
}
.qs-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s ease;
}

.qs-arrow {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 13px;
  color: #2a2a34;
  transition:
    color 0.15s,
    transform 0.15s;
}
.qs-card:hover .qs-arrow {
  color: #888;
  transform: translateX(3px);
}

/* ── Shortcuts ── */
.shortcuts {
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.shortcut-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #2a2a34;
  border-radius: 20px;
  padding: 6px 16px;
  color: #666;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  background: none;
  transition: all 0.15s;
}
.shortcut-btn:hover {
  border-color: #f5a623;
  color: #f5a623;
  background: rgba(245, 166, 35, 0.05);
}

.shortcut-icon {
  font-size: 14px;
}

/* ── Grid ── */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 20px;
  align-items: start;
}

.col-left,
.col-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Section header ── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #555;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-toggle {
  background: none;
  border: 1px solid #2a2a34;
  color: #666;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s;
}
.filter-toggle.active {
  border-color: #f5a623;
  color: #f5a623;
}
.filter-toggle:hover {
  border-color: #444;
  color: #aaa;
}

.ver-todas {
  font-size: 12px;
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.ver-todas:hover {
  color: #f5a623;
}

/* ── Task list ── */
.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 40px;
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #111114;
  border: 1px solid #1e1e24;
  border-radius: 10px;
  padding: 12px 14px;
  transition: border-color 0.15s;
}
.task-row:hover {
  border-color: #2a2a34;
}

.task-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: #e0e0d8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-meta {
  font-size: 11px;
  color: #555;
}

.task-badge {
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #444;
  font-size: 14px;
  background: #111114;
  border: 1px dashed #2a2a34;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.empty-link {
  font-size: 13px;
  color: #f5a623;
  text-decoration: none;
  font-weight: 500;
}
.empty-link:hover {
  text-decoration: underline;
}

/* Transitions */
.task-enter-active,
.task-leave-active {
  transition: all 0.2s ease;
}
.task-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.task-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

@media (max-width: 900px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
