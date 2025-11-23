import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PuntoRecoleccionService } from './puntorecoleccion.service';
import { PuntoRecoleccionController } from './puntorecoleccion.controller';
import { UploadModule } from '../upload/upload.module';
import { PuntoRecoleccion, PuntoRecoleccionSchema } from './schemas/puntorecoleccion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PuntoRecoleccion.name, schema: PuntoRecoleccionSchema }]),
    UploadModule,
  ],
  controllers: [PuntoRecoleccionController],
  providers: [PuntoRecoleccionService],
  exports: [PuntoRecoleccionService],
})
export class PuntoRecoleccionModule {}
