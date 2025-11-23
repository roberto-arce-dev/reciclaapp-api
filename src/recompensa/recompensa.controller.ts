import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { RecompensaService } from './recompensa.service';
import { CreateRecompensaDto } from './dto/create-recompensa.dto';
import { UpdateRecompensaDto } from './dto/update-recompensa.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Recompensa')
@ApiBearerAuth('JWT-auth')
@Controller('recompensa')
export class RecompensaController {
  constructor(
    private readonly recompensaService: RecompensaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Recompensa' })
  @ApiBody({ type: CreateRecompensaDto })
  @ApiResponse({ status: 201, description: 'Recompensa creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createRecompensaDto: CreateRecompensaDto) {
    const data = await this.recompensaService.create(createRecompensaDto);
    return {
      success: true,
      message: 'Recompensa creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Recompensa' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Recompensa' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Recompensa no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.recompensaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { recompensa: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Recompensas' })
  @ApiResponse({ status: 200, description: 'Lista de Recompensas' })
  async findAll() {
    const data = await this.recompensaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Recompensa por ID' })
  @ApiParam({ name: 'id', description: 'ID del Recompensa' })
  @ApiResponse({ status: 200, description: 'Recompensa encontrado' })
  @ApiResponse({ status: 404, description: 'Recompensa no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.recompensaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Recompensa' })
  @ApiParam({ name: 'id', description: 'ID del Recompensa' })
  @ApiBody({ type: UpdateRecompensaDto })
  @ApiResponse({ status: 200, description: 'Recompensa actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Recompensa no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateRecompensaDto: UpdateRecompensaDto
  ) {
    const data = await this.recompensaService.update(id, updateRecompensaDto);
    return {
      success: true,
      message: 'Recompensa actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Recompensa' })
  @ApiParam({ name: 'id', description: 'ID del Recompensa' })
  @ApiResponse({ status: 200, description: 'Recompensa eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Recompensa no encontrado' })
  async remove(@Param('id') id: string) {
    const recompensa = await this.recompensaService.findOne(id);
    if (recompensa.imagen) {
      const filename = recompensa.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.recompensaService.remove(id);
    return { success: true, message: 'Recompensa eliminado exitosamente' };
  }
}
