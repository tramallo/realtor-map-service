import { Controller, Get } from '@nestjs/common';

import { SupabaseService } from './modules/supabase.service';

@Controller()
export class AppController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get()
  async getHello(): Promise<string> {
    const { error, data } = await this.supabase.getProperties();

    return `${data?.length}`;
  }
}
