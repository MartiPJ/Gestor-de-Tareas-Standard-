import api from '@/utils/api'
import type { Proyecto, CreateProyectoPayload } from '@/types'

export const proyectosService = {
  getAll: () => api.get<Proyecto[]>('/api/proyecto'),
  getById: (id: string) => api.get<Proyecto>(`/api/proyecto/${id}`),
  create: (payload: CreateProyectoPayload) => api.post<Proyecto>('/api/proyecto', payload),
  update: (id: string, payload: Partial<CreateProyectoPayload>) =>
    api.patch<Proyecto>(`/api/proyecto/${id}`, payload),
  delete: (id: string) => api.delete<void>(`/api/proyecto/${id}`),
}
