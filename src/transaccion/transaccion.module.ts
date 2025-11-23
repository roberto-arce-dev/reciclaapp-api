import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';
import { UploadModule } from '../upload/upload.module';
import { Transaccion, TransaccionSchema } from './schemas/transaccion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaccion.name, schema: TransaccionSchema }]),
    UploadModule,
  ],
  controllers: [TransaccionController],
  providers: [TransaccionService],
  exports: [TransaccionService],
})
export class TransaccionModule {}
