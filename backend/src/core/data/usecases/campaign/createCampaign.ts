import { Either, Left, Right } from "src/core/shared/either";
import { ICampaignRepository } from "../../interfaces/repositories/campaign";
import { CampaignEntity } from "src/core/domain/entities/campaign";
import { ErrorBase } from "src/core/shared/errorBase";

export interface CreateCampaignUseCaseInput {
    name: string;
}

export interface CreateCampaignUseCaseOutput {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateCampaignUseCase {
    constructor(
        private readonly campaignRepository: ICampaignRepository
    ) {}

    private createCampaignEntity(input: CreateCampaignUseCaseInput): Either<ErrorBase, CampaignEntity> {
        const now = new Date();
        const campaign = CampaignEntity.createWithoutId({ ...input, createdAt: now, updatedAt: now, deleted: false });
        return campaign;
    }

    async exec(input: CreateCampaignUseCaseInput): Promise<Either<ErrorBase, CreateCampaignUseCaseOutput>> {
        const createCampaignEntityOrError = this.createCampaignEntity(input);
        if (createCampaignEntityOrError.left) return Left.create(createCampaignEntityOrError.left);

        const saveCampaignOrError = await this.campaignRepository.create(createCampaignEntityOrError.right);
        if (saveCampaignOrError.left) return Left.create(saveCampaignOrError.left);

        return Right.create({
            id: saveCampaignOrError.right.id,
            name: saveCampaignOrError.right.name,
            createdAt: saveCampaignOrError.right.createdAt,
            updatedAt: saveCampaignOrError.right.updatedAt
        });
    }
}
