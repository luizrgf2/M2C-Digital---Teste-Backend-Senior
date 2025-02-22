import { Either, Left, Right } from "src/core/shared/either";
import { ICampaignRepository } from "../../interfaces/repositories/campaign";
import { ErrorBase } from "src/core/shared/errorBase";
import { NotExistsError } from "../../errors/general";

export interface DeleteCampaignUseCaseInput {
    id: string;
    companyId: string;
    userId: string;
}

export class DeleteCampaignUseCase {
    constructor(private readonly campaignRepository: ICampaignRepository) {}

    async exec(input: DeleteCampaignUseCaseInput): Promise<Either<ErrorBase, void>> {
        const campaignOrError = await this.campaignRepository.findById(input.id, input.companyId, input.userId);
        if (campaignOrError.left) return Left.create(new NotExistsError());

        const deleteOrError = await this.campaignRepository.delete(input.id, input.companyId, input.userId);
        if (deleteOrError.left) return Left.create(deleteOrError.left);

        return Right.create(undefined);
    }
}
