import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMaterialRecicladoDto } from './dto/create-materialreciclado.dto';
import { UpdateMaterialRecicladoDto } from './dto/update-materialreciclado.dto';
import { MaterialReciclado, MaterialRecicladoDocument } from './schemas/materialreciclado.schema';

@Injectable()
export class MaterialRecicladoService {
  constructor(
    @InjectModel(MaterialReciclado.name) private materialrecicladoModel: Model<MaterialRecicladoDocument>,
  ) {}

  async create(createMaterialRecicladoDto: CreateMaterialRecicladoDto): Promise<MaterialReciclado> {
    const nuevoMaterialReciclado = await this.materialrecicladoModel.create(createMaterialRecicladoDto);
    return nuevoMaterialReciclado;
  }

  async findAll(): Promise<MaterialReciclado[]> {
    const materialreciclados = await this.materialrecicladoModel.find();
    return materialreciclados;
  }

  async findOne(id: string | number): Promise<MaterialReciclado> {
    const materialreciclado = await this.materialrecicladoModel.findById(id);
    if (!materialreciclado) {
      throw new NotFoundException(`MaterialReciclado con ID ${id} no encontrado`);
    }
    return materialreciclado;
  }

  async update(id: string | number, updateMaterialRecicladoDto: UpdateMaterialRecicladoDto): Promise<MaterialReciclado> {
    const materialreciclado = await this.materialrecicladoModel.findByIdAndUpdate(id, updateMaterialRecicladoDto, { new: true });
    if (!materialreciclado) {
      throw new NotFoundException(`MaterialReciclado con ID ${id} no encontrado`);
    }
    return materialreciclado;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.materialrecicladoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`MaterialReciclado con ID ${id} no encontrado`);
    }
  }
}
