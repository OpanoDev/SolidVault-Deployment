import { Module } from '@nestjs/common';
import { Auth } from './auth/auth.module';

@Module({
  imports: [Auth],
  controllers: [],
  providers: [],
})
export class AppModule {}
