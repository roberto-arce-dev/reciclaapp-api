import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePuntoRecoleccionDto } from './dto/create-puntorecoleccion.dto';
import { UpdatePuntoRecoleccionDto } from './dto/update-puntorecoleccion.dto';
import { PuntoRecoleccion, PuntoRecoleccionDocument } from './schemas/puntorecoleccion.schema';

@Injectable()
export class PuntoRecoleccionService {
  constructor(
    @InjectModel(PuntoRecoleccion.name) private puntorecoleccionModel: Model<PuntoRecoleccionDocument>,
  ) {}

  async create(createPuntoRecoleccionDto: CreatePuntoRecoleccionDto): Promise<PuntoRecoleccion> {
    const nuevoPuntoRecoleccion = await this.puntorecoleccionModel.create(createPuntoRecoleccionDto);
    return nuevoPuntoRecoleccion;
  }

  async findAll(): Promise<PuntoRecoleccion[]> {
    const puntorecoleccions = await this.puntorecoleccionModel.find();
    return puntorecoleccions;
  }

  async findOne(id: string | number): Promise<PuntoRecoleccion> {
    const puntorecoleccion = await this.puntorecoleccionModel.findById(id);
    if (!puntorecoleccion) {
      throw new NotFoundException(`PuntoRecoleccion con ID ${id} no encontrado`);
    }
    return puntorecoleccion;
  }

  async update(id: string | number, updatePuntoRecoleccionDto: UpdatePuntoRecoleccionDto): Promise<PuntoRecoleccion> {
    const puntorecoleccion = await this.puntorecoleccionModel.findByIdAndUpdate(id, updatePuntoRecoleccionDto, { new: true });
    if (!puntorecoleccion) {
      throw new NotFoundException(`PuntoRecoleccion con ID ${id} no encontrado`);
    }
    return puntorecoleccion;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.puntorecoleccionModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`PuntoRecoleccion con ID ${id} no encontrado`);
    }
  }
}
