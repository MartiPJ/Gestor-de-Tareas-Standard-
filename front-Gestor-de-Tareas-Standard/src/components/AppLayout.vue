<template>
  <div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="brand" v-if="!sidebarCollapsed">
          <span class="brand-icon">◈</span>
          <span class="brand-name">FlowTask</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '›' : '‹' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{
            active: $route.path === item.to || ($route.path.startsWith(item.to) && item.to !== '/'),
          }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label" v-if="!sidebarCollapsed">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <div class="user-pill">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-info">
            <span class="user-name">{{ auth.user?.nombre }}</span>
            <span class="user-email">{{ auth.user?.email }}</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">⏻</button>
      </div>
      <div class="sidebar-footer-mini" v-else>
        <div class="user-avatar-mini">{{ userInitial }}</div>
        <button class="logout-btn-mini" @click="handleLogout">⏻</button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const router = useRouter()
const sidebarCollapsed = ref(false)

const userInitial = computed(() => auth.user?.nombre?.charAt(0).toUpperCase() || '?')

const navItems = [
  { to: '/dashboard', icon: '◉', label: 'Dashboard' },
  { to: '/tareas', icon: '☑', label: 'Tareas' },
  { to: '/proyectos', icon: '⬡', label: 'Proyectos' },
  { to: '/usuarios', icon: '◎', label: 'Usuarios' },
  { to: '/catalogo', icon: '⊞', label: 'Catálogo' },
]

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-shell {
  display: flex;
  height: 100vh;
  background: #0d0d0f;
  font-family: 'DM Sans', sans-serif;
  color: #e8e8e0;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background: #111114;
  border-right: 1px solid #1e1e24;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  flex-shrink: 0;
  z-index: 10;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid #1e1e24;
  min-height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  font-size: 22px;
  color: #f5a623;
  line-height: 1;
}

.brand-name {
  font-family: 'Space Mono', monospace;
  font-size: 15px;
  font-weight: 700;
  color: #f0ede8;
  letter-spacing: -0.5px;
}

.collapse-btn {
  background: none;
  border: 1px solid #2a2a32;
  color: #888;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}
.collapse-btn:hover {
  border-color: #f5a623;
  color: #f5a623;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #777;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover {
  background: #1a1a20;
  color: #ccc;
}
.nav-item.active {
  background: #1e1a12;
  color: #f5a623;
}
.nav-item.active .nav-icon {
  color: #f5a623;
}

.nav-icon {
  font-size: 17px;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.nav-label {
  overflow: hidden;
}

.sidebar-footer {
  padding: 14px 12px;
  border-top: 1px solid #1e1e24;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  overflow: hidden;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #f5a623;
  color: #0d0d0f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #e0e0d8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 11px;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  background: none;
  border: 1px solid #2a2a32;
  color: #555;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}
.logout-btn:hover {
  border-color: #e05252;
  color: #e05252;
}

.sidebar-footer-mini {
  padding: 14px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #1e1e24;
}
.user-avatar-mini {
  width: 32px;
  height: 32px;
  background: #f5a623;
  color: #0d0d0f;
  border-radius: 50%;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logout-btn-mini {
  background: none;
  border: 1px solid #2a2a32;
  color: #555;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.logout-btn-mini:hover {
  border-color: #e05252;
  color: #e05252;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
