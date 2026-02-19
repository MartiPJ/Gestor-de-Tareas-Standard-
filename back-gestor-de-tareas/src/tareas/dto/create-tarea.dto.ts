export class CreateTareaDto {
  titulo: string;
  descripcion?: string;
  proyecto_id: string;
  created_by: string;
  assigned_to: string;
  catalogo_id: string;
}