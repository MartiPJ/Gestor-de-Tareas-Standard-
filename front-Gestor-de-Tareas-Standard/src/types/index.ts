export interface Usuario {
  id: string
  nombre: string
  email: string
  role: string
}

export interface Proyecto {
  id: string
  nombre: string
  descripcion: string
  create_at: string
}

export interface Catalogo {
  id: string
  Estado: string
}

export interface Tarea {
  id: string
  titulo: string
  descripcion: string
  proyecto: Proyecto
  createdBy: Usuario
  assignedTo: Usuario
  catalogo: Catalogo
  createdAt: string
  fechaVencimiento?: string
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    nombre: string
    email: string
  }
}

export interface LoginPayload {
  email: string
  password: string
}

// types.ts
export interface CreateTareaPayload {
  titulo: string
  descripcion?: string
  proyectoId: string // para el backend (proyecto_id)
  assignedToId: string // para el backend (assigned_to)
  catalogoId: string // 👈 ¡CUIDADO! backend espera "catalogo_id"
  createdById: string // 👈 IMPORTANTE: quién crea la tarea
}

export interface CreateProyectoPayload {
  nombre: string
  descripcion: string
}

export interface CreateUsuarioPayload {
  nombre: string
  email: string
  password: string
  role: string
}
