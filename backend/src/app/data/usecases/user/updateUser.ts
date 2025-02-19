import { Either, Left, Right } from "src/app/shared/either";
import { IUserRepository, UpdateUserProps } from "../../interfaces/repositories/user";
import { UserEntity } from "src/app/domain/entities/user";
import { NotExistsError } from "../../errors/general";
import { UserEmailAlreadyExistsError } from "../../errors/user";
import { IPasswordEncryptorService } from "../../interfaces/services/passwordEncryptor";



export interface UpdateUserUseCaseInput {
    id: string;
    email?: string;
    password?: string;
}

export interface UpdateUserUseCaseOutput {
    id: string;
    email: string;
    updatedAt: Date;
    createdAt: Date;
}

export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordEncryptorService: IPasswordEncryptorService
    ) {}

    private async checkIfEmailAlreadyExists(email: string, userId: string): Promise<Either<Error, void>> {
        const userOrError = await this.userRepository.findByEmail(email);
        if (userOrError.left) {
            if (!(userOrError.left instanceof NotExistsError)) {
                return Left.create(userOrError.left);
            }
            return Right.create(undefined);
        }

        if (userOrError.right.id !== userId) {
            return Left.create(new UserEmailAlreadyExistsError());
        }

        return Right.create(undefined);
    }

    private async storeUser(id: string, update: UpdateUserProps): Promise<Either<Error, UserEntity>> {
        const saveOrError = await this.userRepository.update(id, update);
        if (saveOrError.left) return Left.create(saveOrError.left);
        return Right.create(saveOrError.right);
    }

    private async makeToUpdate(email?: string, password?: string): Promise<UpdateUserProps> {
        const toReturn = {
            email: undefined,
            password: undefined
        } as UpdateUserProps

        if(email) {
            toReturn.email = email
        }
        if(password) {
            toReturn.password = await this.passwordEncryptorService.encrypt(password);
        }

        return toReturn
    }

    async exec(input: UpdateUserUseCaseInput): Promise<Either<Error, UpdateUserUseCaseOutput>> {
        const userOrError = await this.userRepository.findById(input.id);
        if (userOrError.left) return Left.create(userOrError.left);

        const userEntity = userOrError.right;

        if(input.email) {
            const checkIfEmailAlreadyExistsOrError = await this.checkIfEmailAlreadyExists(input.email, userEntity.id)
            if(checkIfEmailAlreadyExistsOrError.left) return Left.create(checkIfEmailAlreadyExistsOrError.left)
        }

        const toUpdate =  await this.makeToUpdate(input.email, input.password)

        const saveUserOrError = await this.storeUser(userEntity.id, toUpdate);
        if (saveUserOrError.left) return Left.create(saveUserOrError.left);

        return Right.create({
            id: saveUserOrError.right.id,
            email: saveUserOrError.right.email,
            updatedAt: saveUserOrError.right.updatedAt,
            createdAt: saveUserOrError.right.createdAt,
        });
    }
}
