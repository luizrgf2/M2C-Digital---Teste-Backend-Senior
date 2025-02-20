import { Either, Left, Right } from "src/core/shared/either";
import { IUserRepository } from "../../interfaces/repositories/user";
import { UserEntity } from "src/core/domain/entities/user";
import { UserUpdateAllFieldsIsEmptyError } from "../../errors/user";

export interface GetUserUseCaseInput {
    id?: string;
    email?: string;
}

export interface GetUserUseCaseOutput {
    id: string;
    email: string;
    updatedAt: Date;
    createdAt: Date;
}

export class GetUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    private async getUserFromStore(input: GetUserUseCaseInput) : Promise<Either<Error, UserEntity>> {
        let userOrError: Either<Error, UserEntity>

        if (input.id) {
            userOrError = await this.userRepository.findById(input.id);
            if (userOrError.left) return Left.create(userOrError.left);
            return Right.create(userOrError.right)
        } else {
            userOrError = await this.userRepository.findByEmail(input.email!);
            if (userOrError.left) return Left.create(userOrError.left);
            return Right.create(userOrError.right)
        }
    }

    async exec(input: GetUserUseCaseInput): Promise<Either<Error, GetUserUseCaseOutput>> {
        if (!input.id && !input.email) {
            return Left.create(new UserUpdateAllFieldsIsEmptyError());
        }

        let getUserOrError = await this.getUserFromStore(input)
        if(getUserOrError.left) return Left.create(getUserOrError.left)

        const userEntity = getUserOrError.right

        return Right.create({
            id: userEntity.id,
            email: userEntity.email,
            updatedAt: userEntity.updatedAt,
            createdAt: userEntity.createdAt,
        });
    }
}
