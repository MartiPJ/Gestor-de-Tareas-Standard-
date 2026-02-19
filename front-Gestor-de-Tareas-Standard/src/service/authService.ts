import api from '@/utils/api'
import type { AuthResponse, LoginPayload } from '@/types'

export const authService = {
  login: (payload: LoginPayload) => api.post<AuthResponse>('/api/auth/login', payload),

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
  },
}
