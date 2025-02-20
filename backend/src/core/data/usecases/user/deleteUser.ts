import { Either, Left, Right } from "src/core/shared/either";
import { IUserRepository } from "../../interfaces/repositories/user";
import { NotExistsError } from "../../errors/general";

export interface DeleteUserUseCaseInput {
    id: string;
}

export class DeleteUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async exec(input: DeleteUserUseCaseInput): Promise<Either<Error, void>> {
        const userOrError = await this.userRepository.findById(input.id);
        if (userOrError.left) {
            return Left.create(userOrError.left);
        }

        const deleteOrError = await this.userRepository.delete(input.id);
        if (deleteOrError.left) {
            return Left.create(deleteOrError.left);
        }

        return Right.create(undefined);
    }
}
