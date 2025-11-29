import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { Transaccion, TransaccionDocument } from './schemas/transaccion.schema';

@Injectable()
export class TransaccionService {
  constructor(
    @InjectModel(Transaccion.name) private transaccionModel: Model<TransaccionDocument>,
  ) {}

  async create(createTransaccionDto: CreateTransaccionDto): Promise<Transaccion> {
    const nuevoTransaccion = await this.transaccionModel.create(createTransaccionDto);
    return nuevoTransaccion;
  }

  async findAll(): Promise<Transaccion[]> {
    const transaccions = await this.transaccionModel.find();
    return transaccions;
  }

  async findOne(id: string | number): Promise<Transaccion> {
    const transaccion = await this.transaccionModel.findById(id)
    .populate('usuario', 'nombre email')
    .populate('material', 'nombre tipo puntosKg')
    .populate('puntoRecoleccion', 'nombre direccion horario');
    if (!transaccion) {
      throw new NotFoundException(`Transaccion con ID ${id} no encontrado`);
    }
    return transaccion;
  }

  async update(id: string | number, updateTransaccionDto: UpdateTransaccionDto): Promise<Transaccion> {
    const transaccion = await this.transaccionModel.findByIdAndUpdate(id, updateTransaccionDto, { new: true })
    .populate('usuario', 'nombre email')
    .populate('material', 'nombre tipo puntosKg')
    .populate('puntoRecoleccion', 'nombre direccion horario');
    if (!transaccion) {
      throw new NotFoundException(`Transaccion con ID ${id} no encontrado`);
    }
    return transaccion;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.transaccionModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Transaccion con ID ${id} no encontrado`);
    }
  }
  async findByUsuario(usuarioId: string): Promise<Transaccion[]> {
    return this.transaccionModel.find({ usuario: usuarioId });
  }
  async registrarReciclaje(reciclajeDto: any): Promise<Transaccion> {
    const transaccion = await this.transaccionModel.create(reciclajeDto);
    return transaccion;
  }
  async getPuntosUsuario(usuarioId: string): Promise<number> {
    const transacciones = await this.transaccionModel.find({ usuario: usuarioId });
    return transacciones.reduce((sum, t: any) => sum + (t.puntos || 0), 0);
  }



}
