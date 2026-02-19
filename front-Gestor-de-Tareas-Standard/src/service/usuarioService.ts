import api from '@/utils/api'
import type { Usuario, CreateUsuarioPayload } from '@/types'

export const usuariosService = {
  getAll: () => api.get<Usuario[]>('/api/usuario'),
  getById: (id: string) => api.get<Usuario>(`/api/usuario/${id}`),
  create: (payload: CreateUsuarioPayload) => api.post<Usuario>('/api/usuario', payload),
  update: (id: string, payload: Partial<CreateUsuarioPayload>) =>
    api.patch<Usuario>(`/api/usuario/${id}`, payload),
  delete: (id: string) => api.delete<void>(`/api/usuario/${id}`),
}
