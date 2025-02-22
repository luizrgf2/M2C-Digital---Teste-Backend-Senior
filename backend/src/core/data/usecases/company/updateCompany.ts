import { Either, Left, Right } from "src/core/shared/either";
import { ICompanyRepository, UpdateCompanyProps } from "../../interfaces/repositories/company";
import { CompanyEntity } from "src/core/domain/entities/company";
import { NotExistsError } from "../../errors/general";
import { CompanyNameAlreadyExistsError } from "../../errors/company";
import { ErrorBase } from "src/core/shared/errorBase";

export interface UpdateCompanyUseCaseInput {
    id: string;
    userId: string;
    name?: string;
    document?: string;
}

export interface UpdateCompanyUseCaseOutput {
    id: string;
    name: string;
    document: string;
    updatedAt: Date;
    createdAt: Date;
}

export class UpdateCompanyUseCase {
    constructor(private readonly companyRepository: ICompanyRepository) {}

    private async checkIfNameAlreadyExists(name: string, companyId: string, userId: string): Promise<Either<ErrorBase, void>> {
        const companyOrError = await this.companyRepository.findByName(name, userId);
        if (companyOrError.left) {
            if (!(companyOrError.left instanceof NotExistsError)) {
                return Left.create(companyOrError.left);
            }
            return Right.create(undefined);
        }

        if (companyOrError.right.id !== companyId) {
            return Left.create(new CompanyNameAlreadyExistsError());
        }

        return Right.create(undefined);
    }

    private async storeCompany(id: string, userId: string ,update: UpdateCompanyProps): Promise<Either<ErrorBase, CompanyEntity>> {
        const saveOrError = await this.companyRepository.update(id, userId, update);
        if (saveOrError.left) return Left.create(saveOrError.left);
        return Right.create(saveOrError.right);
    }

    private makeToUpdate(name?: string, document?: string): UpdateCompanyProps {
        const toReturn = {} as UpdateCompanyProps;

        if (name) {
            toReturn.name = name;
        }
        if (document) {
            toReturn.document = document;
        }

        return toReturn;
    }

    async exec(input: UpdateCompanyUseCaseInput): Promise<Either<ErrorBase, UpdateCompanyUseCaseOutput>> {
        const companyOrError = await this.companyRepository.findById(input.id, input.userId);
        if (companyOrError.left) return Left.create(companyOrError.left);

        const companyEntity = companyOrError.right;

        if (input.name) {
            const checkIfNameAlreadyExistsOrError = await this.checkIfNameAlreadyExists(input.name, companyEntity.id, input.userId);
            if (checkIfNameAlreadyExistsOrError.left) return Left.create(checkIfNameAlreadyExistsOrError.left);
        }

        const toUpdate = this.makeToUpdate(input.name, input.document);

        const saveCompanyOrError = await this.storeCompany(input.id, input.userId, toUpdate);
        if (saveCompanyOrError.left) return Left.create(saveCompanyOrError.left);

        return Right.create({
            id: saveCompanyOrError.right.id,
            name: saveCompanyOrError.right.name,
            document: saveCompanyOrError.right.document,
            userId: saveCompanyOrError.right.userId,
            updatedAt: saveCompanyOrError.right.updatedAt,
            createdAt: saveCompanyOrError.right.createdAt,
        });
    }
}
