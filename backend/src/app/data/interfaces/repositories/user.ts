import { UserEntity } from "src/app/domain/entities/user";
import { Either } from "src/app/shared/either";

export interface UpdateUserProps {
    email?: string
    password?: string
}

export interface IUserRepository {
    create(user: UserEntity) : Promise<Either<Error, UserEntity>>
    findById(id: string) : Promise<Either<Error, UserEntity>>
    findByEmail(email: string): Promise<Either<Error, UserEntity>>
    update(id: string, update: UpdateUserProps): Promise<Either<Error, UserEntity>>
    delete(id: string): Promise<Either<Error, UserEntity>>
}