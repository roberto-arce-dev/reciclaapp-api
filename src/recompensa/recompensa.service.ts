import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRecompensaDto } from './dto/create-recompensa.dto';
import { UpdateRecompensaDto } from './dto/update-recompensa.dto';
import { Recompensa, RecompensaDocument } from './schemas/recompensa.schema';
import { Canje, CanjeDocument } from './schemas/canje.schema';
import { UsuarioProfileService } from '../usuario-profile/usuario-profile.service';

@Injectable()
export class RecompensaService {
  constructor(
    @InjectModel(Recompensa.name) private recompensaModel: Model<RecompensaDocument>,
    @InjectModel(Canje.name) private canjeModel: Model<CanjeDocument>,
    private usuarioProfileService: UsuarioProfileService,
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
    const recompensa = await this.recompensaModel.findById(id);
    if (!recompensa) {
      throw new NotFoundException(`Recompensa con ID ${id} no encontrado`);
    }
    return recompensa;
  }

  async update(id: string | number, updateRecompensaDto: UpdateRecompensaDto): Promise<Recompensa> {
    const recompensa = await this.recompensaModel.findByIdAndUpdate(id, updateRecompensaDto, { new: true });
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

  async findDisponibles(usuarioId: string): Promise<Recompensa[]> {
    return this.recompensaModel.find({ activa: true, stock: { $gt: 0 } });
  }

  async findCanjeadas(usuarioId: string): Promise<Canje[]> {
    const profile = await this.usuarioProfileService.findByUserId(usuarioId);
    return this.canjeModel.find({ usuario: (profile as any)._id })
      .populate('recompensa')
      .sort({ fechaCanje: -1 });
  }

  async canjearRecompensa(canjeDto: { usuarioId: string; recompensaId: string }): Promise<Canje> {
    const { usuarioId, recompensaId } = canjeDto;

    // 1. Obtener perfil y recompensa
    const profile = await this.usuarioProfileService.findByUserId(usuarioId);
    const recompensa = await this.recompensaModel.findById(recompensaId);

    if (!recompensa) {
      throw new NotFoundException('Recompensa no encontrada');
    }
    if (!recompensa.activa || recompensa.stock <= 0) {
      throw new BadRequestException('Recompensa no disponible o sin stock');
    }

    // 2. Verificar puntos
    const currentPoints = (profile as any).puntos || 0;
    if (currentPoints < recompensa.puntosRequeridos) {
      throw new BadRequestException(`Puntos insuficientes. Tienes ${currentPoints}, necesitas ${recompensa.puntosRequeridos}`);
    }

    // 3. Crear canje y actualizar puntos/stock (Idealmente en transacción, simulado aquí)
    const nuevoCanje = await this.canjeModel.create({
      usuario: (profile as any)._id,
      recompensa: recompensa._id,
      puntosGastados: recompensa.puntosRequeridos,
      fechaCanje: new Date(),
      estado: 'pendiente'
    });

    // Descontar puntos
    await this.usuarioProfileService.update(usuarioId, { 
      puntos: currentPoints - recompensa.puntosRequeridos 
    } as any);

    // Decrementar stock
    recompensa.stock -= 1;
    await recompensa.save();

    return nuevoCanje;
  }
}
