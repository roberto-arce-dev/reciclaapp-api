import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaterialRecicladoService } from './materialreciclado.service';
import { MaterialRecicladoController } from './materialreciclado.controller';
import { UploadModule } from '../upload/upload.module';
import { MaterialReciclado, MaterialRecicladoSchema } from './schemas/materialreciclado.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MaterialReciclado.name, schema: MaterialRecicladoSchema }]),
    UploadModule,
  ],
  controllers: [MaterialRecicladoController],
  providers: [MaterialRecicladoService],
  exports: [MaterialRecicladoService],
})
export class MaterialRecicladoModule {}
