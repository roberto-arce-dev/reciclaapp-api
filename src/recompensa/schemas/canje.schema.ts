import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CanjeDocument = Canje & Document;

@Schema({ timestamps: true })
export class Canje {
  @Prop({ type: Types.ObjectId, ref: 'UsuarioProfile', required: true })
  usuario: Types.ObjectId; // Link to Profile for points management? Or User? User usually. But Profile has points. Let's use Profile or User and resolve. Profile is better if we link points. But User is auth. Let's use User and populate Profile or just use Profile ID.

  @Prop({ type: Types.ObjectId, ref: 'Recompensa', required: true })
  recompensa: Types.ObjectId;

  @Prop({ required: true })
  puntosGastados: number;

  @Prop({ default: Date.now })
  fechaCanje: Date;

  @Prop({ enum: ['pendiente', 'entregado', 'cancelado'], default: 'pendiente' })
  estado: string;
}

export const CanjeSchema = SchemaFactory.createForClass(Canje);

CanjeSchema.index({ usuario: 1 });
CanjeSchema.index({ fechaCanje: -1 });
