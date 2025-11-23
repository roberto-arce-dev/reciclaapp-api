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
import { MaterialRecicladoService } from './materialreciclado.service';
import { CreateMaterialRecicladoDto } from './dto/create-materialreciclado.dto';
import { UpdateMaterialRecicladoDto } from './dto/update-materialreciclado.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('MaterialReciclado')
@ApiBearerAuth('JWT-auth')
@Controller('material-reciclado')
export class MaterialRecicladoController {
  constructor(
    private readonly materialrecicladoService: MaterialRecicladoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo MaterialReciclado' })
  @ApiBody({ type: CreateMaterialRecicladoDto })
  @ApiResponse({ status: 201, description: 'MaterialReciclado creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createMaterialRecicladoDto: CreateMaterialRecicladoDto) {
    const data = await this.materialrecicladoService.create(createMaterialRecicladoDto);
    return {
      success: true,
      message: 'MaterialReciclado creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Materialreciclado' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Materialreciclado' })
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
  @ApiResponse({ status: 404, description: 'Materialreciclado no encontrado' })
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
    const updated = await this.materialrecicladoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { materialreciclado: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los MaterialReciclados' })
  @ApiResponse({ status: 200, description: 'Lista de MaterialReciclados' })
  async findAll() {
    const data = await this.materialrecicladoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener MaterialReciclado por ID' })
  @ApiParam({ name: 'id', description: 'ID del MaterialReciclado' })
  @ApiResponse({ status: 200, description: 'MaterialReciclado encontrado' })
  @ApiResponse({ status: 404, description: 'MaterialReciclado no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.materialrecicladoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar MaterialReciclado' })
  @ApiParam({ name: 'id', description: 'ID del MaterialReciclado' })
  @ApiBody({ type: UpdateMaterialRecicladoDto })
  @ApiResponse({ status: 200, description: 'MaterialReciclado actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'MaterialReciclado no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateMaterialRecicladoDto: UpdateMaterialRecicladoDto
  ) {
    const data = await this.materialrecicladoService.update(id, updateMaterialRecicladoDto);
    return {
      success: true,
      message: 'MaterialReciclado actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar MaterialReciclado' })
  @ApiParam({ name: 'id', description: 'ID del MaterialReciclado' })
  @ApiResponse({ status: 200, description: 'MaterialReciclado eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'MaterialReciclado no encontrado' })
  async remove(@Param('id') id: string) {
    const materialreciclado = await this.materialrecicladoService.findOne(id);
    if (materialreciclado.imagen) {
      const filename = materialreciclado.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.materialrecicladoService.remove(id);
    return { success: true, message: 'MaterialReciclado eliminado exitosamente' };
  }
}
