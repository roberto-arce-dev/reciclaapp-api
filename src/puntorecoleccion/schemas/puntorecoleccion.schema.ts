import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PuntoRecoleccionDocument = PuntoRecoleccion & Document;

@Schema({ timestamps: true })
export class PuntoRecoleccion {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  direccion: string;

  @Prop()
  horario?: string;

  @Prop({ type: [String], default: [] })
  materiales?: any;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const PuntoRecoleccionSchema = SchemaFactory.createForClass(PuntoRecoleccion);

PuntoRecoleccionSchema.index({ nombre: 1 });
