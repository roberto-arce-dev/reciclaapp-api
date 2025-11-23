import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecompensaDocument = Recompensa & Document;

@Schema({ timestamps: true })
export class Recompensa {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario: Types.ObjectId;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ min: 0 })
  puntosRequeridos: number;

  @Prop({ default: Date.now })
  fechaCanje?: Date;

  @Prop({ enum: ['canjeada', 'entregada', 'cancelada'], default: 'canjeada' })
  estado?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const RecompensaSchema = SchemaFactory.createForClass(Recompensa);

RecompensaSchema.index({ usuario: 1 });
RecompensaSchema.index({ estado: 1 });
RecompensaSchema.index({ fechaCanje: -1 });
