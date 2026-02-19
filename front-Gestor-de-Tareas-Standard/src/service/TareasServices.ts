// services/TareasServices.ts
import api from '@/utils/api'
import type { Tarea, CreateTareaPayload } from '@/types'

export const tareasService = {
  getAll: () => api.get<Tarea[]>('/api/tareas'),
  getById: (id: string) => api.get<Tarea>(`/api/tareas/${id}`),
  create: (payload: CreateTareaPayload) => {
    const backendPayload = {
      titulo: payload.titulo,
      descripcion: payload.descripcion,
      proyecto_id: payload.proyectoId,
      assigned_to: payload.assignedToId,
      catalogo_id: payload.catalogoId,
      created_by: payload.createdById,
    }
    return api.post<Tarea>('/api/tareas', backendPayload)
  },
  update: (id: string, payload: Partial<CreateTareaPayload>) => {
    const backendPayload: any = {}
    if (payload.titulo !== undefined) backendPayload.titulo = payload.titulo
    if (payload.descripcion !== undefined) backendPayload.descripcion = payload.descripcion
    if (payload.proyectoId !== undefined) backendPayload.proyectoId = payload.proyectoId
    if (payload.assignedToId !== undefined) backendPayload.assignedToId = payload.assignedToId
    if (payload.catalogoId !== undefined) backendPayload.catalogoId = payload.catalogoId

    return api.patch<Tarea>(`/api/tareas/${id}`, backendPayload)
  },
  delete: (id: string) => api.delete<void>(`/api/tareas/${id}`),
}
