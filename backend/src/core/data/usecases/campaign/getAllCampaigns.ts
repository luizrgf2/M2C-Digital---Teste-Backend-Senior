import { Either, Left, Right } from "src/core/shared/either";
import { ICampaignRepository, PaginationCampaignProps } from "../../interfaces/repositories/campaign";
import { ErrorBase } from "src/core/shared/errorBase";

export interface GetAllCampaignsUseCaseInput {
    size?: number;
    skip?: number;
}

export interface GetAllCampaignsUseCaseOutput {
    campaigns: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    count: number;
}

export class GetAllCampaignsUseCase {
    private readonly DEFAULT_SIZE = 10;
    private readonly DEFAULT_SKIP = 0;

    constructor(private readonly campaignRepository: ICampaignRepository) {}

    async exec(input: GetAllCampaignsUseCaseInput): Promise<Either<ErrorBase, GetAllCampaignsUseCaseOutput>> {
        const pagination: PaginationCampaignProps = {
            size: input.size ?? this.DEFAULT_SIZE,
            skip: input.skip ?? this.DEFAULT_SKIP
        };

        const campaignsOrError = await this.campaignRepository.findAll(pagination);
        if (campaignsOrError.left) return Left.create(campaignsOrError.left);

        const { campaigns, count } = campaignsOrError.right;

        return Right.create({
            campaigns: campaigns.map(campaign => ({
                id: campaign.id,
                name: campaign.name,
                createdAt: campaign.createdAt,
                updatedAt: campaign.updatedAt,
            })),
            count
        });
    }
}
