import { PartialType } from '@nestjs/swagger';
import { CreateMaterialRecicladoDto } from './create-materialreciclado.dto';

export class UpdateMaterialRecicladoDto extends PartialType(CreateMaterialRecicladoDto) {}
