export class MaterialReciclado {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<MaterialReciclado>) {
    Object.assign(this, partial);
  }
}
