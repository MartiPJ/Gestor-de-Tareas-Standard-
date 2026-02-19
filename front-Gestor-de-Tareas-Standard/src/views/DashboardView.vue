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

    <!-- Quick stats -->
    <div class="quick-stats">
      <div class="qs-card" v-for="s in quickStats" :key="s.label">
        <div class="qs-icon" :style="{ color: s.color }">{{ s.icon }}</div>
        <div class="qs-data">
          <span class="qs-value">{{ s.value }}</span>
          <span class="qs-label">{{ s.label }}</span>
        </div>
        <div class="qs-bar">
          <div class="qs-bar-fill" :style="{ width: s.pct + '%', background: s.color }"></div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Health Monitor -->
      <div class="col-left">
        <HealthMonitor :tareas="tareas" :proyectos="proyectos" />
      </div>

      <!-- Recent tasks + My tasks -->
      <div class="col-right">
        <!-- Filter: mis tareas -->
        <div class="section-header">
          <span class="section-title">Mis Tareas</span>
          <button
            class="filter-toggle"
            :class="{ active: filterMine }"
            @click="filterMine = !filterMine"
          >
            {{ filterMine ? '◉ Solo mías' : '◎ Todas' }}
          </button>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
    { label: 'Tareas totales', value: total, icon: '☑', color: '#e8e8e0', pct: 100 },
    {
      label: 'Completadas',
      value: completadas,
      icon: '✓',
      color: '#52c97e',
      pct: total ? (completadas / total) * 100 : 0,
    },
    {
      label: 'Pendientes',
      value: pendientes,
      icon: '◷',
      color: '#f5a623',
      pct: total ? (pendientes / total) * 100 : 0,
    },
    { label: 'Proyectos', value: proyectosTotal, icon: '⬡', color: '#4e9af5', pct: 100 },
  ]
})

const filteredTareas = computed(() => {
  let list = [...tareas.value].slice(0, 10)
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
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

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

.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 28px;
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
}

/* Task list transition */
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
