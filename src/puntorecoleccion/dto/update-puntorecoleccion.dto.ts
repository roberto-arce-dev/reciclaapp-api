import { PartialType } from '@nestjs/swagger';
import { CreatePuntoRecoleccionDto } from './create-puntorecoleccion.dto';

export class UpdatePuntoRecoleccionDto extends PartialType(CreatePuntoRecoleccionDto) {}
