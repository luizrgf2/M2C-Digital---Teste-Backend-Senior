import { CompanyEntity } from 'src/core/domain/entities/company';
import { Company as CompanyModel } from '@prisma/client';

export class CompanyPresenter {
    static toEntity(model: CompanyModel): CompanyEntity {
        return new CompanyEntity({
            id: model.id,
            name: model.name,
            document: model.document,
            userId: model.user_id,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
            deleted: model.deleted,
        });
    }

    static toModel(entity: CompanyEntity): CompanyModel {
        return {
            id: entity.id,
            name: entity.name,
            document: entity.document,
            created_at: entity.createdAt,
            user_id: !entity.userId ? "": entity.userId,
            updated_at: entity.updatedAt,
            deleted: entity.deleted,
        };
    }
}
