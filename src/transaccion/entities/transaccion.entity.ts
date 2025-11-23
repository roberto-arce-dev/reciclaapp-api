export class Transaccion {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Transaccion>) {
    Object.assign(this, partial);
  }
}
