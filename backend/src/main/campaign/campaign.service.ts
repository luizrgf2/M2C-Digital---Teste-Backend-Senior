import { HttpException, Injectable } from '@nestjs/common';
import { CreateCampaignUseCase } from 'src/core/data/usecases/campaign/createCampaign';
import { CampaignRepository } from 'src/infra/database/campaignRepository.service';
import { GetAllCampaignsUseCase } from 'src/core/data/usecases/campaign/getAllCampaigns';
import { GetCampaignUseCase } from 'src/core/data/usecases/campaign/getCampaign';
import { UpdateCampaignProps } from 'src/core/data/interfaces/repositories/campaign';
import { DeleteCampaignUseCase } from 'src/core/data/usecases/campaign/deleteCampaign';
import { UpdateCampaignUseCase } from 'src/core/data/usecases/campaign/updateCampaign';
import { ErrorBase } from 'src/core/shared/errorBase';
import { CreateCampaignDto } from './dto/createCampaign.dto';
import { MessageProducerService } from 'src/infra/services/rabbitmq/messageProducer.service';

@Injectable()
export class CampaignService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly messageProducer: MessageProducerService
  ){}

  private errorHandling(error?: ErrorBase) {
    if (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  async create(createCampaignDto: CreateCampaignDto, fileText: string, userId: string) {
    const usecase = new CreateCampaignUseCase(this.campaignRepository, this.messageProducer);
    const res = await usecase.exec({...createCampaignDto, userId,listNumbers: fileText});
    this.errorHandling(res.left);
    return res.right;
  }

  async findAll(size: number, skip: number, companyId: string, userId: string) {
    const usecase = new GetAllCampaignsUseCase(this.campaignRepository);
    const res = await usecase.exec({
      size,
      skip,
      companyId,
      userId
    });
    this.errorHandling(res.left);
    return res.right;
  }

  async findOne(id: string, companyId: string, userId: string) {
    const usecase = new GetCampaignUseCase(this.campaignRepository);
    const res = await usecase.exec({ id, companyId, userId});
    this.errorHandling(res.left);
    return res.right;
  }

  async update(id: string, companyId: string, userId: string, updateCampaignDto: UpdateCampaignProps) {
    const usecase = new UpdateCampaignUseCase(this.campaignRepository);
    const res = await usecase.exec({ id, companyId, userId, ...updateCampaignDto });
    this.errorHandling(res.left);
    return res.right;
  }

  async remove(id: string, companyId: string, userId: string) {
    const usecase = new DeleteCampaignUseCase(this.campaignRepository);
    const res = await usecase.exec({ id , companyId, userId});
    this.errorHandling(res.left);
    return res.right;
  }
}
