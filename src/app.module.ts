import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { SupabaseModule } from './modules/supabase.module';

@Module({
  imports: [ConfigModule.forRoot(), SupabaseModule],
  controllers: [AppController],
})
export class AppModule {}
