<template>
  <div class="health-monitor">
    <div class="hm-header">
      <span class="hm-title">Health Monitor</span>
      <span class="hm-badge" :class="healthStatus.class">{{ healthStatus.label }}</span>
    </div>

    <!-- Stats row -->
    <div class="hm-stats">
      <div class="stat" v-for="s in stats" :key="s.label">
        <span class="stat-value" :style="{ color: s.color }">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Progress bars per estado -->
    <div class="hm-bars">
      <div class="bar-row" v-for="item in statusBreakdown" :key="item.estado">
        <span class="bar-label">{{ item.estado }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: item.pct + '%', background: item.color }"></div>
        </div>
        <span class="bar-count">{{ item.count }}</span>
      </div>
    </div>

    <!-- Mini sparkline: tareas por proyecto -->
    <div class="hm-chart">
      <span class="chart-title">Tareas por proyecto</span>
      <div class="chart-bars">
        <div
          class="chart-col"
          v-for="p in projectBars"
          :key="p.nombre"
          :title="p.nombre + ': ' + p.total + ' tareas'"
        >
          <div class="chart-bar-wrap">
            <div class="chart-bar-fill" :style="{ height: p.pct + '%' }"></div>
          </div>
          <span class="chart-label">{{ p.short }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tarea, Proyecto } from '@/types'

const props = defineProps<{
  tareas: Tarea[]
  proyectos: Proyecto[]
}>()

const STATUS_COLORS: Record<string, string> = {
  pendiente: '#f5a623',
  'en progreso': '#4e9af5',
  completado: '#52c97e',
  bloqueado: '#e05252',
}

const DEFAULT_COLOR = '#666'

function getColor(estado: string) {
  return STATUS_COLORS[estado.toLowerCase()] ?? DEFAULT_COLOR
}

const total = computed(() => props.tareas.length)

const statusBreakdown = computed(() => {
  const map = new Map<string, number>()
  for (const t of props.tareas) {
    const e = t.catalogo?.Estado || 'sin estado'
    map.set(e, (map.get(e) || 0) + 1)
  }
  return Array.from(map.entries()).map(([estado, count]) => ({
    estado,
    count,
    pct: total.value ? Math.round((count / total.value) * 100) : 0,
    color: getColor(estado),
  }))
})

const stats = computed(() => {
  const completadas =
    statusBreakdown.value.find((s) => s.estado.toLowerCase() === 'completado')?.count || 0
  const pendientes =
    statusBreakdown.value.find((s) => s.estado.toLowerCase() === 'pendiente')?.count || 0
  const rate = total.value ? Math.round((completadas / total.value) * 100) : 0
  return [
    { label: 'Total', value: total.value, color: '#e8e8e0' },
    { label: 'Completadas', value: completadas, color: '#52c97e' },
    { label: 'Pendientes', value: pendientes, color: '#f5a623' },
    {
      label: 'Tasa',
      value: rate + '%',
      color: rate > 60 ? '#52c97e' : rate > 30 ? '#f5a623' : '#e05252',
    },
  ]
})

const healthStatus = computed(() => {
  const rate = total.value
    ? ((statusBreakdown.value.find((s) => s.estado.toLowerCase() === 'completado')?.count || 0) /
        total.value) *
      100
    : 0
  if (rate >= 70) return { label: '● Saludable', class: 'healthy' }
  if (rate >= 40) return { label: '● En riesgo', class: 'warning' }
  return { label: '● Atención', class: 'danger' }
})

const projectBars = computed(() => {
  const map = new Map<string, number>()
  for (const t of props.tareas) {
    const n = t.proyecto?.nombre || 'Sin proyecto'
    map.set(n, (map.get(n) || 0) + 1)
  }
  const max = Math.max(...Array.from(map.values()), 1)
  return Array.from(map.entries()).map(([nombre, total]) => ({
    nombre,
    total,
    pct: Math.round((total / max) * 100),
    short: nombre.slice(0, 6),
  }))
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

.health-monitor {
  background: #111114;
  border: 1px solid #1e1e24;
  border-radius: 14px;
  padding: 20px;
  font-family: 'DM Sans', sans-serif;
}

.hm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.hm-title {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #888;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hm-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}
.hm-badge.healthy {
  color: #52c97e;
  background: rgba(82, 201, 126, 0.1);
}
.hm-badge.warning {
  color: #f5a623;
  background: rgba(245, 166, 35, 0.1);
}
.hm-badge.danger {
  color: #e05252;
  background: rgba(224, 82, 82, 0.1);
}

.hm-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #161618;
  border-radius: 10px;
  padding: 12px 8px;
}

.stat-value {
  font-family: 'Space Mono', monospace;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hm-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-label {
  font-size: 12px;
  color: #888;
  width: 90px;
  flex-shrink: 0;
  text-transform: capitalize;
}

.bar-track {
  flex: 1;
  height: 6px;
  background: #1e1e26;
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.bar-count {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #555;
  width: 20px;
  text-align: right;
}

.hm-chart {
  border-top: 1px solid #1e1e24;
  padding-top: 16px;
}

.chart-title {
  font-size: 11px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 12px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 60px;
}

.chart-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.chart-bar-wrap {
  flex: 1;
  width: 100%;
  background: #1a1a20;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  min-height: 40px;
}

.chart-bar-fill {
  width: 100%;
  background: #f5a623;
  border-radius: 4px 4px 0 0;
  transition: height 0.6s ease;
  min-height: 4px;
}

.chart-label {
  font-size: 10px;
  color: #555;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>
