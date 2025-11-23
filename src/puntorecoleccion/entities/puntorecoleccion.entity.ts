export class PuntoRecoleccion {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PuntoRecoleccion>) {
    Object.assign(this, partial);
  }
}
