import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SupabaseService } from "./supabase.service";
import { SupabaseGateway } from "./supabase.gateway";

@Module({
  imports: [ConfigModule],
  providers: [SupabaseService, SupabaseGateway],
  exports: [SupabaseService],
})
export class SupabaseModule {}