import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecompensaService } from './recompensa.service';
import { RecompensaController } from './recompensa.controller';
import { UploadModule } from '../upload/upload.module';
import { Recompensa, RecompensaSchema } from './schemas/recompensa.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recompensa.name, schema: RecompensaSchema }]),
    UploadModule,
  ],
  controllers: [RecompensaController],
  providers: [RecompensaService],
  exports: [RecompensaService],
})
export class RecompensaModule {}
