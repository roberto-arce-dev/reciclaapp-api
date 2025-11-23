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
import { PuntoRecoleccionService } from './puntorecoleccion.service';
import { CreatePuntoRecoleccionDto } from './dto/create-puntorecoleccion.dto';
import { UpdatePuntoRecoleccionDto } from './dto/update-puntorecoleccion.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('PuntoRecoleccion')
@ApiBearerAuth('JWT-auth')
@Controller('punto-recoleccion')
export class PuntoRecoleccionController {
  constructor(
    private readonly puntorecoleccionService: PuntoRecoleccionService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo PuntoRecoleccion' })
  @ApiBody({ type: CreatePuntoRecoleccionDto })
  @ApiResponse({ status: 201, description: 'PuntoRecoleccion creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createPuntoRecoleccionDto: CreatePuntoRecoleccionDto) {
    const data = await this.puntorecoleccionService.create(createPuntoRecoleccionDto);
    return {
      success: true,
      message: 'PuntoRecoleccion creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Puntorecoleccion' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Puntorecoleccion' })
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
  @ApiResponse({ status: 404, description: 'Puntorecoleccion no encontrado' })
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
    const updated = await this.puntorecoleccionService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { puntorecoleccion: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los PuntoRecoleccions' })
  @ApiResponse({ status: 200, description: 'Lista de PuntoRecoleccions' })
  async findAll() {
    const data = await this.puntorecoleccionService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener PuntoRecoleccion por ID' })
  @ApiParam({ name: 'id', description: 'ID del PuntoRecoleccion' })
  @ApiResponse({ status: 200, description: 'PuntoRecoleccion encontrado' })
  @ApiResponse({ status: 404, description: 'PuntoRecoleccion no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.puntorecoleccionService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar PuntoRecoleccion' })
  @ApiParam({ name: 'id', description: 'ID del PuntoRecoleccion' })
  @ApiBody({ type: UpdatePuntoRecoleccionDto })
  @ApiResponse({ status: 200, description: 'PuntoRecoleccion actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'PuntoRecoleccion no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updatePuntoRecoleccionDto: UpdatePuntoRecoleccionDto
  ) {
    const data = await this.puntorecoleccionService.update(id, updatePuntoRecoleccionDto);
    return {
      success: true,
      message: 'PuntoRecoleccion actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar PuntoRecoleccion' })
  @ApiParam({ name: 'id', description: 'ID del PuntoRecoleccion' })
  @ApiResponse({ status: 200, description: 'PuntoRecoleccion eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'PuntoRecoleccion no encontrado' })
  async remove(@Param('id') id: string) {
    const puntorecoleccion = await this.puntorecoleccionService.findOne(id);
    if (puntorecoleccion.imagen) {
      const filename = puntorecoleccion.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.puntorecoleccionService.remove(id);
    return { success: true, message: 'PuntoRecoleccion eliminado exitosamente' };
  }
}
