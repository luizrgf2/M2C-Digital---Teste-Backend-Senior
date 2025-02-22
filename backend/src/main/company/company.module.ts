import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  imports : [DatabaseModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
