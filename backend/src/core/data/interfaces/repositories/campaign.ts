import { CampaignEntity } from "src/core/domain/entities/campaign";
import { CompanyEntity } from "src/core/domain/entities/company";
import { Either } from "src/core/shared/either";
import { ErrorBase } from "src/core/shared/errorBase";

export interface UpdateCampaignProps {
    name?: string
}

export interface PaginationCampaignProps {
    size: number,
    skip: number
}

export interface PaginationCampaignOutput {
    campaigns: CampaignEntity[],
    count: number
}

export interface ICampaignRepository {
    create(company: CampaignEntity) : Promise<Either<ErrorBase, CampaignEntity>>
    findById(id: string) : Promise<Either<ErrorBase, CampaignEntity>>
    findByName(name: string) : Promise<Either<ErrorBase, CampaignEntity>>
    findAll(pagination: PaginationCampaignProps): Promise<Either<ErrorBase, PaginationCampaignOutput>>
    update(id: string, update: UpdateCampaignProps): Promise<Either<ErrorBase, CampaignEntity>>
    delete(id: string): Promise<Either<ErrorBase, void>>
}