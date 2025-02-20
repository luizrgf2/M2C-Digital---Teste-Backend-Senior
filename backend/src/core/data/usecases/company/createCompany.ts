import { Either, Left, Right } from "src/core/shared/either";
import { ICompanyRepository } from "../../interfaces/repositories/company";
import { CompanyEntity } from "src/core/domain/entities/company";
import { ErrorBase } from "src/core/shared/errorBase";
import { NotExistsError } from "../../errors/general";
import { CompanyNameAlreadyExistsError } from "../../errors/company";

export interface CreateCompanyUseCaseInput {
    name: string;
    document: string;
}

export interface CreateCompanyUseCaseOutput {
    id: string;
    name: string;
    document: string;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateCompanyUseCase {
    constructor(private readonly companyRepository: ICompanyRepository) {}

    private createCompanyEntity(input: CreateCompanyUseCaseInput): Either<ErrorBase, CompanyEntity> {
        const now = new Date();
        const company = CompanyEntity.createWithoutId({ ...input, createdAt: now, updatedAt: now, deleted: false });

        return company;
    }

    private async checkIfCompanyNameExists(name: string): Promise<Either<ErrorBase, void>> {
        const companyOrError = await this.companyRepository.findByName(name);
        if (companyOrError.left) {
            if (!(companyOrError.left instanceof NotExistsError)) {
                return Left.create(companyOrError.left);
            }
            return Right.create(undefined);
        }
        return Left.create(new CompanyNameAlreadyExistsError());
    }

    private async storeCompany(company: CompanyEntity): Promise<Either<ErrorBase, CompanyEntity>> {
        const saveOrError = await this.companyRepository.create(company);
        if (saveOrError.left) return Left.create(saveOrError.left);
        return Right.create(saveOrError.right);
    }

    async exec(input: CreateCompanyUseCaseInput): Promise<Either<ErrorBase, CreateCompanyUseCaseOutput>> {
        const companyNameExistsOrError = await this.checkIfCompanyNameExists(input.name);
        if (companyNameExistsOrError.left) return Left.create(companyNameExistsOrError.left);

        const createCompanyEntityOrError = this.createCompanyEntity(input);
        if (createCompanyEntityOrError.left) return Left.create(createCompanyEntityOrError.left);

        const saveCompanyOrError = await this.storeCompany(createCompanyEntityOrError.right);
        if (saveCompanyOrError.left) return Left.create(saveCompanyOrError.left);

        return Right.create({
            id: saveCompanyOrError.right.id,
            name: saveCompanyOrError.right.name,
            document: saveCompanyOrError.right.document,
            createdAt: saveCompanyOrError.right.createdAt,
            updatedAt: saveCompanyOrError.right.updatedAt,
        });
    }
}
