import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { RabbitMqModule } from 'src/infra/services/rabbitmq/rabbitmq.module';

@Module({
  imports: [DatabaseModule, RabbitMqModule],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
