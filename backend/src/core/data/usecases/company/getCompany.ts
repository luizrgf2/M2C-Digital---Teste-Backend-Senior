import { Either, Left, Right } from "src/core/shared/either";
import { ICompanyRepository } from "../../interfaces/repositories/company";
import { CompanyEntity } from "src/core/domain/entities/company";
import { ErrorBase } from "src/core/shared/errorBase";
import { NotExistsError } from "../../errors/general";

export interface GetCompanyUseCaseInput {
    id?: string;
    name?: string;
    userId: string
}

export interface GetCompanyUseCaseOutput {
    id: string;
    name: string;
    document: string;
    createdAt: Date;
    updatedAt: Date;
}

export class GetCompanyUseCase {
    constructor(private readonly companyRepository: ICompanyRepository) {}

    private async findCompany(input: GetCompanyUseCaseInput): Promise<Either<ErrorBase, CompanyEntity>> {
        if (input.id) {
            return this.companyRepository.findById(input.id, input.userId);
        } else if (input.name) {
            return this.companyRepository.findByName(input.name, input.userId);
        }
        return Left.create(new NotExistsError());
    }

    async exec(input: GetCompanyUseCaseInput): Promise<Either<ErrorBase, GetCompanyUseCaseOutput>> {
        const companyOrError = await this.findCompany(input);
        if (companyOrError.left) return Left.create(companyOrError.left);

        const company = companyOrError.right;

        return Right.create({
            id: company.id,
            name: company.name,
            document: company.document,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt,
        });
    }
}
