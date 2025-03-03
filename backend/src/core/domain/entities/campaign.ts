import { Either, Left, Right } from "src/core/shared/either";
import { CampaignInvalidNameError } from "../errors/campaigns";
import { ErrorBase } from "src/core/shared/errorBase";

export interface ICampaign {
    id: string;
    name: string;
    finalized: boolean,
    companyId?: string,
    userId?: string,
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

    get finalized(): boolean {
        return this.campaign.finalized
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

    get companyId(): string | undefined {
        return this.campaign.companyId
    }

    get userId(): string | undefined {
        return this.campaign.userId
    }

    set deleted(deleted: boolean) {
        this.campaign.deleted = deleted;
    }

    private isValidName(): boolean {
        return this.name.length >= 4 && this.name.length <= 100;
    }

    validate(): Either<ErrorBase, void> {
        if (!this.isValidName()) {
            return Left.create(new CampaignInvalidNameError());
        }

        return Right.create(undefined);
    }

    static create(campaign: ICampaign): Either<ErrorBase, CampaignEntity> {
        const campaignEntity = new CampaignEntity(campaign);
        const validation = campaignEntity.validate();
        if (validation.left) return Left.create(validation.left);

        return Right.create(campaignEntity);
    }

    static createWithoutId(campaign: Omit<ICampaign, "id">): Either<ErrorBase, CampaignEntity> {
        return this.create({ ...campaign, id: "" });
    }
}
