import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransaccionDocument = Transaccion & Document;

@Schema({ timestamps: true })
export class Transaccion {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MaterialReciclado', required: true })
  material: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PuntoRecoleccion', required: true })
  puntoRecoleccion: Types.ObjectId;

  @Prop({ min: 0 })
  cantidad: number;

  @Prop({ default: 0, min: 0 })
  puntos?: number;

  @Prop({ default: Date.now })
  fecha?: Date;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const TransaccionSchema = SchemaFactory.createForClass(Transaccion);

TransaccionSchema.index({ usuario: 1 });
TransaccionSchema.index({ material: 1 });
TransaccionSchema.index({ puntoRecoleccion: 1 });
TransaccionSchema.index({ fecha: -1 });
