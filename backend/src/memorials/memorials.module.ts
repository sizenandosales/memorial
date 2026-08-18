import { Module } from '@nestjs/common';
import { MemorialsController } from './memorials.controller';
import { MemorialsService } from './memorials.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [MemorialsController],
  providers: [MemorialsService],
})
export class MemorialsModule {}
