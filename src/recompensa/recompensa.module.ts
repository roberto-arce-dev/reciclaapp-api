import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecompensaService } from './recompensa.service';
import { RecompensaController } from './recompensa.controller';
import { UploadModule } from '../upload/upload.module';
import { Recompensa, RecompensaSchema } from './schemas/recompensa.schema';
import { Canje, CanjeSchema } from './schemas/canje.schema';
import { UsuarioProfileModule } from '../usuario-profile/usuario-profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recompensa.name, schema: RecompensaSchema },
      { name: Canje.name, schema: CanjeSchema },
    ]),
    UploadModule,
    UsuarioProfileModule,
  ],
  controllers: [RecompensaController],
  providers: [RecompensaService],
  exports: [RecompensaService],
})
export class RecompensaModule {}
