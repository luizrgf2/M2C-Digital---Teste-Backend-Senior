import { Either, Left, Right } from "src/core/shared/either";
import { ICampaignRepository } from "../../interfaces/repositories/campaign";
import { CampaignEntity } from "src/core/domain/entities/campaign";
import { ErrorBase } from "src/core/shared/errorBase";
import { NotExistsError } from "../../errors/general";

export interface GetCampaignUseCaseInput {
    id: string;
    companyId: string;
}

export interface GetCampaignUseCaseOutput {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export class GetCampaignUseCase {
    constructor(private readonly campaignRepository: ICampaignRepository) {}

    async exec(input: GetCampaignUseCaseInput): Promise<Either<ErrorBase, GetCampaignUseCaseOutput>> {
        const campaignOrError = await this.campaignRepository.findById(input.id, input.companyId);
        if (campaignOrError.left) return Left.create(campaignOrError.left);

        const campaign = campaignOrError.right;

        return Right.create({
            id: campaign.id,
            name: campaign.name,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
        });
    }
}
