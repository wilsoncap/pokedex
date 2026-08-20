import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
  // importa el adater en el modulo para ser usado
  providers: [AxiosAdapter],
  // exports exponer el adaptador a otros modulos
  exports: [AxiosAdapter],
})
export class CommonModule {}
