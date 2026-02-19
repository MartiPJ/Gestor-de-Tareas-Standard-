import { defineStore } from 'pinia'
import { ref } from 'vue'
import { proyectosService } from '@/service/proyectoService'
import type { Proyecto, CreateProyectoPayload } from '@/types'

export const useProyectosStore = defineStore('proyectos', () => {
  const proyectos = ref<Proyecto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      proyectos.value = await proyectosService.getAll()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CreateProyectoPayload) {
    const nuevo = await proyectosService.create(payload)
    proyectos.value.unshift(nuevo)
    return nuevo
  }

  async function update(id: string, payload: Partial<CreateProyectoPayload>) {
    const updated = await proyectosService.update(id, payload)
    const idx = proyectos.value.findIndex((p) => p.id === id)
    if (idx !== -1) proyectos.value[idx] = updated
    return updated
  }

  async function remove(id: string) {
    await proyectosService.delete(id)
    proyectos.value = proyectos.value.filter((p) => p.id !== id)
  }

  return { proyectos, loading, error, fetchAll, create, update, remove }
})
