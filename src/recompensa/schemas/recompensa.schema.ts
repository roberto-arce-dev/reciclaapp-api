import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecompensaDocument = Recompensa & Document;

@Schema({ timestamps: true })
export class Recompensa {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ min: 0, required: true })
  puntosRequeridos: number;

  @Prop({ min: 0, default: 0 })
  stock: number;

  @Prop({ default: true })
  activa: boolean;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;
}

export const RecompensaSchema = SchemaFactory.createForClass(Recompensa);

RecompensaSchema.index({ activa: 1 });
RecompensaSchema.index({ puntosRequeridos: 1 });
