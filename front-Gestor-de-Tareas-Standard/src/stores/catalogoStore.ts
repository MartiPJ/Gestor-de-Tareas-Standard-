import { defineStore } from 'pinia'
import { ref } from 'vue'
import { catalogoService } from '@/service/catalogoService'
import type { Catalogo } from '@/types'

export const useCatalogoStore = defineStore('catalogo', () => {
  const catalogos = ref<Catalogo[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      catalogos.value = await catalogoService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function create(payload: { Estado: string }) {
    const nuevo = await catalogoService.create(payload)
    catalogos.value.push(nuevo)
    return nuevo
  }

  async function update(id: string, payload: { Estado: string }) {
    const updated = await catalogoService.update(id, payload)
    const idx = catalogos.value.findIndex((c) => c.id === id)
    if (idx !== -1) catalogos.value[idx] = updated
    return updated
  }

  async function remove(id: string) {
    await catalogoService.delete(id)
    catalogos.value = catalogos.value.filter((c) => c.id !== id)
  }

  return { catalogos, loading, fetchAll, create, update, remove }
})
