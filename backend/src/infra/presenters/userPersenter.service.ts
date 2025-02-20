
import { UserEntity } from "src/core/domain/entities/user";
import { User } from "@prisma/client"; 

export class UserPresenter {
    static toEntity(userModel: User): UserEntity {
        return new UserEntity({
            id: userModel.id,
            email: userModel.email,
            password: userModel.password,
            createdAt: userModel.created_at,
            updatedAt: userModel.updated_at,
            deleted: userModel.deleted,
        });
    }

    static toModel(userEntity: UserEntity): User {
        return {
            id: userEntity.id,
            email: userEntity.email,
            password: userEntity.password,
            created_at: userEntity.createdAt,
            updated_at: userEntity.updatedAt,
            deleted: userEntity.deleted,
        } as User;
    }
}
