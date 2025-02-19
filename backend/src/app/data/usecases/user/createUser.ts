import { Either, Left, Right } from "src/app/shared/either";
import { IUserRepository } from "../../interfaces/repositories/user";
import { UserEntity } from "src/app/domain/entities/user";
import { NotExistsError } from "../../errors/general";
import { UserEmailAlreadyExistsError } from "../../errors/user";
import { IPasswordEncryptorService } from "../../interfaces/services/passwordEncryptor";

export interface CreateUserUseCaseInput {
    email: string
    password: string
}

export interface CreateUserUseCaseOutput  {
    id: string;
    email: string;
    createdAt: Date,
    updatedAt: Date
}

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordEncryptorService: IPasswordEncryptorService
    ) {}

    private createUserEntity(input: CreateUserUseCaseInput): Either<Error, UserEntity> {
        const now = new Date()
        const user = UserEntity.createWithoutId({...input, createdAt: now, updatedAt: now})
        return user
    }

    private async checkIfEmailAlreadyExists(email: string): Promise<Either<Error, void>> {
        const userOrError = await this.userRepository.findByEmail(email)
        if (userOrError.left) {
            if (!(userOrError.left instanceof NotExistsError)) {
                return Left.create(userOrError.left)
            }
            return Right.create(undefined)
        }
        return Left.create(new UserEmailAlreadyExistsError())
    }

    private async storeUser(user: UserEntity): Promise<Either<Error, UserEntity>> {
        user.password = await this.passwordEncryptorService.encrypt(user.password)
        const saveOrError = await this.userRepository.create(user)
        if(saveOrError.left) return Left.create(saveOrError.left)
        return Right.create(saveOrError.right)
    }

    async exec(input: CreateUserUseCaseInput): Promise<Either<Error, CreateUserUseCaseOutput> >{
        const createUserEntityOrError = this.createUserEntity(input)
        if(createUserEntityOrError.left) return Left.create(createUserEntityOrError.left)
        
        const userEmailAlreadyExistsOrError = await this.checkIfEmailAlreadyExists(input.email)
        if(userEmailAlreadyExistsOrError.left) return Left.create(userEmailAlreadyExistsOrError.left)
        
        const saveUserOrError = await this.storeUser(createUserEntityOrError.right)
        if(saveUserOrError.left) return Left.create(saveUserOrError.left)

        return Right.create({
            id: saveUserOrError.right.id,
            email: saveUserOrError.right.email,
            createdAt: saveUserOrError.right.createdAt,
            updatedAt: saveUserOrError.right.updatedAt
        })
    }
}