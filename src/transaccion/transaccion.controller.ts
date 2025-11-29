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
import { TransaccionService } from './transaccion.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Transaccion')
@ApiBearerAuth('JWT-auth')
@Controller('transaccion')
export class TransaccionController {
  constructor(
    private readonly transaccionService: TransaccionService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Transaccion' })
  @ApiBody({ type: CreateTransaccionDto })
  @ApiResponse({ status: 201, description: 'Transaccion creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createTransaccionDto: CreateTransaccionDto) {
    const data = await this.transaccionService.create(createTransaccionDto);
    return {
      success: true,
      message: 'Transaccion creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Transaccion' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Transaccion' })
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
  @ApiResponse({ status: 404, description: 'Transaccion no encontrado' })
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
    const updated = await this.transaccionService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { transaccion: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Transaccions' })
  @ApiResponse({ status: 200, description: 'Lista de Transaccions' })
  async findAll() {
    const data = await this.transaccionService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener transacciones de un usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Historial de reciclajes del usuario' })
  async findByUsuario(@Param('usuarioId') usuarioId: string) {
    const data = await this.transaccionService.findByUsuario(usuarioId);
    return { success: true, data, total: data.length };
  }

  @Post('registrar-reciclaje')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar transacción de reciclaje' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        usuarioId: { type: 'string', description: 'ID del usuario' },
        materialId: { type: 'string', description: 'ID del material reciclado' },
        puntoRecoleccionId: { type: 'string', description: 'ID del punto de recolección' },
        cantidad: { type: 'number', description: 'Cantidad reciclada' },
        unidad: { type: 'string', description: 'Unidad de medida (kg, unidades, etc.)' }
      },
      required: ['usuarioId', 'materialId', 'puntoRecoleccionId', 'cantidad']
    }
  })
  @ApiResponse({ status: 201, description: 'Reciclaje registrado exitosamente' })
  async registrarReciclaje(@Body() reciclajeDto: {
    usuarioId: string;
    materialId: string;
    puntoRecoleccionId: string;
    cantidad: number;
    unidad?: string;
  }) {
    const data = await this.transaccionService.registrarReciclaje(reciclajeDto);
    return {
      success: true,
      message: 'Reciclaje registrado exitosamente',
      data,
    };
  }

  @Get('usuario/:usuarioId/puntos')
  @ApiOperation({ summary: 'Obtener puntos acumulados por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Puntos totales del usuario' })
  async getPuntosUsuario(@Param('usuarioId') usuarioId: string) {
    const data = await this.transaccionService.getPuntosUsuario(usuarioId);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Transaccion por ID' })
  @ApiParam({ name: 'id', description: 'ID del Transaccion' })
  @ApiResponse({ status: 200, description: 'Transaccion encontrado' })
  @ApiResponse({ status: 404, description: 'Transaccion no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.transaccionService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Transaccion' })
  @ApiParam({ name: 'id', description: 'ID del Transaccion' })
  @ApiBody({ type: UpdateTransaccionDto })
  @ApiResponse({ status: 200, description: 'Transaccion actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Transaccion no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateTransaccionDto: UpdateTransaccionDto
  ) {
    const data = await this.transaccionService.update(id, updateTransaccionDto);
    return {
      success: true,
      message: 'Transaccion actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Transaccion' })
  @ApiParam({ name: 'id', description: 'ID del Transaccion' })
  @ApiResponse({ status: 200, description: 'Transaccion eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Transaccion no encontrado' })
  async remove(@Param('id') id: string) {
    const transaccion = await this.transaccionService.findOne(id);
    if (transaccion.imagen) {
      const filename = transaccion.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.transaccionService.remove(id);
    return { success: true, message: 'Transaccion eliminado exitosamente' };
  }
}
