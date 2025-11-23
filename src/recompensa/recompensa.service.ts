import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRecompensaDto } from './dto/create-recompensa.dto';
import { UpdateRecompensaDto } from './dto/update-recompensa.dto';
import { Recompensa, RecompensaDocument } from './schemas/recompensa.schema';

@Injectable()
export class RecompensaService {
  constructor(
    @InjectModel(Recompensa.name) private recompensaModel: Model<RecompensaDocument>,
  ) {}

  async create(createRecompensaDto: CreateRecompensaDto): Promise<Recompensa> {
    const nuevoRecompensa = await this.recompensaModel.create(createRecompensaDto);
    return nuevoRecompensa;
  }

  async findAll(): Promise<Recompensa[]> {
    const recompensas = await this.recompensaModel.find();
    return recompensas;
  }

  async findOne(id: string | number): Promise<Recompensa> {
    const recompensa = await this.recompensaModel.findById(id)
    .populate('usuario', 'nombre email');
    if (!recompensa) {
      throw new NotFoundException(`Recompensa con ID ${id} no encontrado`);
    }
    return recompensa;
  }

  async update(id: string | number, updateRecompensaDto: UpdateRecompensaDto): Promise<Recompensa> {
    const recompensa = await this.recompensaModel.findByIdAndUpdate(id, updateRecompensaDto, { new: true })
    .populate('usuario', 'nombre email');
    if (!recompensa) {
      throw new NotFoundException(`Recompensa con ID ${id} no encontrado`);
    }
    return recompensa;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.recompensaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Recompensa con ID ${id} no encontrado`);
    }
  }
}
