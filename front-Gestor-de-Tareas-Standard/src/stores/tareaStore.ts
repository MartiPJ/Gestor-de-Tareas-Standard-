// tareaStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tareasService } from '@/service/TareasServices'
import type { Tarea, CreateTareaPayload } from '@/types'
import { useAuthStore } from './authStore'

export const useTareasStore = defineStore('tareas', () => {
  const tareas = ref<Tarea[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      tareas.value = await tareasService.getAll()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CreateTareaPayload) {
    // Asegurar que el usuario actual es el creador
    const payloadWithCreator = {
      ...payload,
      createdById: authStore.user?.id || payload.createdById,
    }
    const nueva = await tareasService.create(payloadWithCreator)
    tareas.value.unshift(nueva)
    return nueva
  }

  async function update(id: string, payload: Partial<CreateTareaPayload>) {
    const updated = await tareasService.update(id, payload)
    const idx = tareas.value.findIndex((t) => t.id === id)
    if (idx !== -1) tareas.value[idx] = updated
    return updated
  }

  async function remove(id: string) {
    await tareasService.delete(id)
    tareas.value = tareas.value.filter((t) => t.id !== id)
  }

  return { tareas, loading, error, fetchAll, create, update, remove }
})
