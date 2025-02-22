import { Either, Left, Right } from "src/core/shared/either";
import { CampaignInvalidNameError } from "../errors/campaigns";

export interface ICampaign {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
}

export class CampaignEntity {
    private campaign: ICampaign;

    constructor(campaign: ICampaign) {
        this.campaign = campaign;
    }

    get id(): string {
        return this.campaign.id;
    }

    set id(id: string) {
        this.campaign.id = id;
    }

    get name(): string {
        return this.campaign.name;
    }

    set name(name: string) {
        this.campaign.name = name;
    }

    get createdAt(): Date {
        return this.campaign.createdAt;
    }

    get updatedAt(): Date {
        return this.campaign.updatedAt;
    }

    get deleted(): boolean {
        return this.campaign.deleted;
    }

    set deleted(deleted: boolean) {
        this.campaign.deleted = deleted;
    }

    private isValidName(): boolean {
        return this.name.length >= 4 && this.name.length <= 100;
    }

    validate(): Either<Error, void> {
        if (!this.isValidName()) {
            return Left.create(new CampaignInvalidNameError());
        }

        return Right.create(undefined);
    }

    static create(campaign: ICampaign): Either<Error, CampaignEntity> {
        const campaignEntity = new CampaignEntity(campaign);
        const validation = campaignEntity.validate();
        if (validation.left) return Left.create(validation.left);

        return Right.create(campaignEntity);
    }

    static createWithoutId(campaign: Omit<ICampaign, "id">): Either<Error, CampaignEntity> {
        return this.create({ ...campaign, id: "" });
    }
}
