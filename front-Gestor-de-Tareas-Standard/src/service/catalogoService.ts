import api from '@/utils/api'
import type { Catalogo } from '@/types'

export const catalogoService = {
  getAll: () => api.get<Catalogo[]>('/api/catalogo'),
  create: (payload: { Estado: string }) => api.post<Catalogo>('/api/catalogo', payload),
  update: (id: string, payload: { Estado: string }) =>
    api.patch<Catalogo>(`/api/catalogo/${id}`, payload),
  delete: (id: string) => api.delete<void>(`/api/catalogo/${id}`),
}
