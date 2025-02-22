import { Injectable } from '@nestjs/common';
import { Either, Left, Right } from 'src/core/shared/either';
import { PrismaService } from './prisma.service';
import { ICampaignRepository, PaginationCampaignProps, UpdateCampaignProps } from 'src/core/data/interfaces/repositories/campaign';
import { NotExistsError } from 'src/core/data/errors/general';
import { ServerError } from 'src/errors/general';
import { ErrorBase } from 'src/core/shared/errorBase';
import { createId } from '@paralleldrive/cuid2';
import { CampaignEntity } from 'src/core/domain/entities/campaign';
import { CampaignPresenter } from '../presenters/campaignPresenter.service';

@Injectable()
export class CampaignRepository implements ICampaignRepository {
    constructor(private readonly prisma: PrismaService) {}
    async create(campaign: CampaignEntity): Promise<Either<ErrorBase, CampaignEntity>> {
        try {
            const createdCampaign = await this.prisma.campaign.create({
                data: {
                    id: createId(),
                    name: campaign.name,
                    finalized: false,
                    company_id: campaign.companyId as string,
                    created_at: campaign.createdAt,
                    updated_at: campaign.updatedAt,
                    deleted: false,
                },
            });
            return Right.create(CampaignPresenter.toEntity(createdCampaign))
        } catch (error) {
            return Left.create(new ServerError(`Erro ao criar campanha`));
        }
    }

    async findById(id: string, companyId: string): Promise<Either<ErrorBase, CampaignEntity>> {
        try {
            const campaign = await this.prisma.campaign.findUnique({
                where: {
                    id,
                    deleted: false,
                    company_id: companyId
                },
            });
            if (!campaign) {
                return Left.create(new NotExistsError());
            }
            return Right.create(CampaignPresenter.toEntity(campaign))
        } catch (error) {
            return Left.create(new ServerError(`Erro ao buscar campanha por ID`));
        }
    }

    async findByName(name: string, companyId: string): Promise<Either<ErrorBase, CampaignEntity>> {
        try {
            const campaign = await this.prisma.campaign.findFirst({
                where: {
                    name,
                    deleted: false,
                    company_id: companyId
                },
            });
            if (!campaign) {
                return Left.create(new NotExistsError());
            }
            return Right.create(CampaignPresenter.toEntity(campaign))
        } catch (error) {
            return Left.create(new ServerError(`Erro ao buscar campanha por nome`));
        }
    }

    async findAll(pagination: PaginationCampaignProps, companyId: string): Promise<Either<ErrorBase, { campaigns: CampaignEntity[]; count: number }>> {
        try {
            const [campaigns, count] = await this.prisma.$transaction([
                this.prisma.campaign.findMany({
                    where: { deleted: false, company_id: companyId },
                    take: pagination.size,
                    skip: pagination.skip,
                }),
                this.prisma.campaign.count({ where: { deleted: false } }),
            ]);
            return Right.create({ campaigns: campaigns.map(c => CampaignPresenter.toEntity(c)), count });
        } catch (error) {
            return Left.create(new ServerError(`Erro ao buscar campanhas`));
        }
    }

    async update(id: string, companyId: string, update: UpdateCampaignProps): Promise<Either<ErrorBase, CampaignEntity>> {
        try {
            const updatedCampaign = await this.prisma.campaign.update({
                where: {
                    id,
                    deleted: false,
                    company_id: companyId
                },
                data: {
                    ...update,
                    updated_at: new Date(),
                },
            });
            return Right.create(CampaignPresenter.toEntity(updatedCampaign))
        } catch (error) {
            return Left.create(new ServerError(`Erro ao atualizar campanha`));
        }
    }

    async delete(id: string, companyId: string): Promise<Either<ErrorBase, void>> {
        try {
            await this.prisma.campaign.update({
                where: {
                    id,
                    deleted: false,
                },
                data: {
                    deleted: true,
                },
            });
            return Right.create(undefined);
        } catch (error) {
            return Left.create(new ServerError(`Erro ao deletar campanha`));
        }
    }
}
