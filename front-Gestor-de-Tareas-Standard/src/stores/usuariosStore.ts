import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usuariosService } from '@/service/usuarioService'
import type { Usuario, CreateUsuarioPayload } from '@/types'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref<Usuario[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      usuarios.value = await usuariosService.getAll()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CreateUsuarioPayload) {
    const nuevo = await usuariosService.create(payload)
    usuarios.value.unshift(nuevo)
    return nuevo
  }

  async function update(id: string, payload: Partial<CreateUsuarioPayload>) {
    const updated = await usuariosService.update(id, payload)
    const idx = usuarios.value.findIndex((u) => u.id === id)
    if (idx !== -1) usuarios.value[idx] = updated
    return updated
  }

  async function remove(id: string) {
    await usuariosService.delete(id)
    usuarios.value = usuarios.value.filter((u) => u.id !== id)
  }

  return { usuarios, loading, error, fetchAll, create, update, remove }
})
