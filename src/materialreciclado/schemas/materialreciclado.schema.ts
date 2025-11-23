import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MaterialRecicladoDocument = MaterialReciclado & Document;

@Schema({ timestamps: true })
export class MaterialReciclado {
  @Prop({ unique: true })
  nombre: string;

  @Prop({ enum: ['plastico', 'vidrio', 'papel', 'carton', 'metal', 'organico'], default: 'plastico' })
  tipo?: string;

  @Prop({ default: 10, min: 0 })
  puntosKg?: number;

  @Prop()
  descripcion?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const MaterialRecicladoSchema = SchemaFactory.createForClass(MaterialReciclado);

MaterialRecicladoSchema.index({ nombre: 1 });
MaterialRecicladoSchema.index({ tipo: 1 });
