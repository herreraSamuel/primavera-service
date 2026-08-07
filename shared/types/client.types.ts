export interface Client {
  id: number | string;
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  nit: string | null;
  documento_identidad: string | null;
  direccion: string | null;
  telefono: string | null;
  correo_electronico: string | null;
  departamento_id: number | null;
  deleted_at: Date | string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
}

export type CreateClientDTO = Omit<Client, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
