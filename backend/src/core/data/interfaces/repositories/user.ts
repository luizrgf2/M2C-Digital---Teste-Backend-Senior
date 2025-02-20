import { UserEntity } from "src/core/domain/entities/user";
import { Either } from "src/core/shared/either";
import { ErrorBase } from "src/core/shared/errorBase";

export interface UpdateUserProps {
    email?: string
    password?: string
}

export interface IUserRepository {
    create(user: UserEntity) : Promise<Either<ErrorBase, UserEntity>>
    findById(id: string) : Promise<Either<ErrorBase, UserEntity>>
    findByEmail(email: string): Promise<Either<ErrorBase, UserEntity>>
    update(id: string, update: UpdateUserProps): Promise<Either<ErrorBase, UserEntity>>
    delete(id: string): Promise<Either<ErrorBase, void>>
}