import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecompensaDto {
  @ApiProperty({
    example: 'Nombre del Recompensa',
    description: 'Nombre del Recompensa',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: 'Descripción del Recompensa',
    description: 'Descripción opcional',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/imagen.jpg',
    description: 'URL de la imagen',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'URL del thumbnail',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
