import { Either, Left, Right } from "src/core/shared/either";
import { ICampaignRepository, UpdateCampaignProps } from "../../interfaces/repositories/campaign";
import { CampaignEntity } from "src/core/domain/entities/campaign";
import { NotExistsError } from "../../errors/general";
import { ErrorBase } from "src/core/shared/errorBase";

export interface UpdateCampaignUseCaseInput {
    id: string;
    companyId: string;
    name?: string;
}

export interface UpdateCampaignUseCaseOutput {
    id: string;
    name: string;
    updatedAt: Date;
    createdAt: Date;
}

export class UpdateCampaignUseCase {
    constructor(private readonly campaignRepository: ICampaignRepository) {}

    private async storeCampaign(id: string, companyId: string, update: UpdateCampaignProps): Promise<Either<ErrorBase, CampaignEntity>> {
        const saveOrError = await this.campaignRepository.update(id, companyId, update);
        if (saveOrError.left) return Left.create(saveOrError.left);
        return Right.create(saveOrError.right);
    }

    private makeToUpdate(name?: string): UpdateCampaignProps {
        const toReturn = {} as UpdateCampaignProps;

        if (name) {
            toReturn.name = name;
        }

        return toReturn;
    }

    async exec(input: UpdateCampaignUseCaseInput): Promise<Either<ErrorBase, UpdateCampaignUseCaseOutput>> {
        const campaignOrError = await this.campaignRepository.findById(input.id, input.companyId);
        if (campaignOrError.left) return Left.create(campaignOrError.left);

        const campaignEntity = campaignOrError.right;

        const toUpdate = this.makeToUpdate(input.name);

        const saveCampaignOrError = await this.storeCampaign(campaignEntity.id, input.companyId, toUpdate);
        if (saveCampaignOrError.left) return Left.create(saveCampaignOrError.left);

        return Right.create({
            id: saveCampaignOrError.right.id,
            name: saveCampaignOrError.right.name,
            updatedAt: saveCampaignOrError.right.updatedAt,
            createdAt: saveCampaignOrError.right.createdAt,
        });
    }
}
