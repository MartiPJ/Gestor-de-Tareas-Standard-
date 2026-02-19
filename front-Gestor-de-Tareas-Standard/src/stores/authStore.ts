import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginPayload } from '@/types'
import { authService } from '@/service/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('authToken'))
  const user = ref<{ id: string; nombre: string; email: string } | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null'),
  )

  const isAuthenticated = computed(() => !!token.value)

  async function login(payload: LoginPayload) {
    const res = await authService.login(payload)
    token.value = res.accessToken
    user.value = res.user
    localStorage.setItem('authToken', res.accessToken)
    localStorage.setItem('currentUser', JSON.stringify(res.user))
  }

  function logout() {
    authService.logout()
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, login, logout }
})
