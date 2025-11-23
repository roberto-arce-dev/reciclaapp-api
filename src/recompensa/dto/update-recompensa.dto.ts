import { PartialType } from '@nestjs/swagger';
import { CreateRecompensaDto } from './create-recompensa.dto';

export class UpdateRecompensaDto extends PartialType(CreateRecompensaDto) {}
