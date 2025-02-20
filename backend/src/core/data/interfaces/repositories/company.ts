import { CompanyEntity } from "src/core/domain/entities/company";
import { Either } from "src/core/shared/either";
import { ErrorBase } from "src/core/shared/errorBase";

export interface UpdateCompanyProps {
    name?: string
    document?: string
}

export interface PaginationCompanyProps {
    size: number,
    skip: number
}

export interface PaginationCompanyOutput {
    companies: CompanyEntity[],
    count: number
}

export interface ICompanyRepository {
    create(company: CompanyEntity) : Promise<Either<ErrorBase, CompanyEntity>>
    findById(id: string) : Promise<Either<ErrorBase, CompanyEntity>>
    findByName(name: string) : Promise<Either<ErrorBase, CompanyEntity>>
    findAll(pagination: PaginationCompanyProps): Promise<Either<ErrorBase, PaginationCompanyOutput>>
    update(id: string, update: UpdateCompanyProps): Promise<Either<ErrorBase, CompanyEntity>>
    delete(id: string): Promise<Either<ErrorBase, void>>
}