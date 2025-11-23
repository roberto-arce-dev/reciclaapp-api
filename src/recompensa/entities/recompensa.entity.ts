export class Recompensa {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Recompensa>) {
    Object.assign(this, partial);
  }
}
