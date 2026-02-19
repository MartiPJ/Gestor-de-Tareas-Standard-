import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { RouteRecordRaw } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import ProyectosView from '@/views/ProyectosView.vue'
import CatalogoView from '@/views/CatalogoView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import TareasView from '@/views/TareasView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/Proyectos',
    name: 'proyectos',
    component: ProyectosView,
    meta: { requiresAuth: true },
  },
  {
    path: '/Catalogo',
    name: 'catalogo',
    component: CatalogoView,
    meta: { requiresAuth: true },
  },
  {
    path: '/Usuarios',
    name: 'usuarios',
    component: UsuariosView,
    meta: { requiresAuth: true },
  },
  {
    path: '/Tareas',
    name: 'tareas',
    component: TareasView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const allowedRoles = to.meta.allowedRoles as string[] | undefined

  // Verificar autenticación si hay token
  // if (authStore.token && !authStore.isAuthenticated) {
  //   await authStore.checkAuth()
  // }

  // 🚨 Si requiere login y no está autenticado
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  // 🚨 Validar roles si existen
  // if (allowedRoles && authStore.user?.roles) {
  //   const userRole = authStore.user.roles.toString().toLowerCase() // Convertir a string y minúscula

  //   if (!allowedRoles.includes(userRole)) {
  //     // Puedes redirigir al dashboard u otra vista
  //     return next({ name: 'dashboard' })
  //   }
  // }

  // 🚨 Si ya está autenticado y quiere ir a login
  if (to.name === 'login' && authStore.isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
