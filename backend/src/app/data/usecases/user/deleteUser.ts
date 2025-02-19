import { Either, Left, Right } from "src/app/shared/either";
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
        // Verificar se o usuário existe
        const userOrError = await this.userRepository.findById(input.id);
        if (userOrError.left) {
            // Retornar erro se o usuário não existe
            return Left.create(userOrError.left);
        }

        // Deletar o usuário
        const deleteOrError = await this.userRepository.delete(input.id);
        if (deleteOrError.left) {
            return Left.create(deleteOrError.left);
        }

        // Retornar sucesso sem dados
        return Right.create(undefined);
    }
}
