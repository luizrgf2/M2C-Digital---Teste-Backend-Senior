import { CampaignEntity } from "src/core/domain/entities/campaign";
import { ICampaign } from "src/core/domain/entities/campaign";

export class CampaignPresenter {
    static toEntity(model: any): CampaignEntity {
        return new CampaignEntity({
            id: model.id,
            name: model.name,
            finalized: model.finalized,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
            companyId: model.companyId ? model.companyId : undefined,
            deleted: model.deleted,
        });
    }

    static toModel(entity: CampaignEntity): ICampaign {
        return {
            id: entity.id,
            name: entity.name,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            finalized: entity.finalized,
            companyId: entity.companyId  ? entity.companyId : undefined,
            deleted: entity.deleted,
        };
    }
}
