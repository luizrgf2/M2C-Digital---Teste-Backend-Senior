import { Either, Left, Right } from "src/core/shared/either";
import { ICompanyRepository, PaginationCompanyProps } from "../../interfaces/repositories/company";
import { ErrorBase } from "src/core/shared/errorBase";

export interface GetAllCompaniesUseCaseInput {
    size?: number;
    skip?: number;
    userId: string;
}

export interface GetAllCompaniesUseCaseOutput {
    companies: {
        id: string;
        name: string;
        document: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    count: number;
}

export class GetAllCompaniesUseCase {
    private readonly DEFAULT_SIZE = 10;
    private readonly DEFAULT_SKIP = 0;

    constructor(private readonly companyRepository: ICompanyRepository) {}

    async exec(input: GetAllCompaniesUseCaseInput): Promise<Either<ErrorBase, GetAllCompaniesUseCaseOutput>> {
        const pagination: PaginationCompanyProps = {
            size: input.size ?? this.DEFAULT_SIZE,
            skip: input.skip ?? this.DEFAULT_SKIP
        };

        const companiesOrError = await this.companyRepository.findAll(pagination, input.userId);
        if (companiesOrError.left) return Left.create(companiesOrError.left);

        const { companies, count } = companiesOrError.right;

        return Right.create({
            companies: companies.map(company => ({
                id: company.id,
                name: company.name,
                document: company.document,
                createdAt: company.createdAt,
                updatedAt: company.updatedAt,
            })),
            count
        });
    }
}
