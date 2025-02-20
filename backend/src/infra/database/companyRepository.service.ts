import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ICompanyRepository, UpdateCompanyProps, PaginationCompanyProps, PaginationCompanyOutput } from 'src/core/data/interfaces/repositories/company';
import { CompanyEntity } from 'src/core/domain/entities/company';
import { Either, Left, Right } from 'src/core/shared/either';
import { CompanyPresenter } from '../presenters/companyPresenter.service';
import { ErrorBase } from 'src/core/shared/errorBase';
import { ServerError } from 'src/errors/general';
import { NotExistsError } from 'src/core/data/errors/general';
import { createId } from '@paralleldrive/cuid2';


@Injectable()
export class CompanyRepository implements ICompanyRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(company: CompanyEntity): Promise<Either<ErrorBase, CompanyEntity>> {
        try {
            const createdCompany = await this.prisma.company.create({
                data: {
                    id: createId(),
                    name: company.name,
                    document: company.document,
                    created_at: company.createdAt,
                    updated_at: company.updatedAt,
                    deleted: false,
                },
            });
            return Right.create(CompanyPresenter.toEntity(createdCompany));
        } catch (error) {
            return Left.create(new ServerError(`Erro ao criar empresa: ${error.message}`));
        }
    }

    async findById(id: string): Promise<Either<ErrorBase, CompanyEntity>> {
        try {
            const company = await this.prisma.company.findUnique({
                where: {
                    id,
                    deleted: false,
                },
            });

            if (!company) {
                return Left.create(new NotExistsError());
            }

            return Right.create(CompanyPresenter.toEntity(company));
        } catch (error) {
            return Left.create(new ServerError(`Erro ao buscar empresa por ID: ${error.message}`));
        }
    }

    async findAll(pagination: PaginationCompanyProps): Promise<Either<ErrorBase, PaginationCompanyOutput>> {
        try {
            const [companies, count] = await this.prisma.$transaction([
                this.prisma.company.findMany({
                    where: { deleted: false },
                    take: pagination.size,
                    skip: pagination.skip,
                }),
                this.prisma.company.count({
                    where: { deleted: false },
                }),
            ]);

            return Right.create({
                companies: companies.map(CompanyPresenter.toEntity),
                count,
            });
        } catch (error) {
            return Left.create(new ServerError(`Erro ao buscar empresas: ${error.message}`));
        }
    }

    async update(id: string, update: UpdateCompanyProps): Promise<Either<ErrorBase, CompanyEntity>> {
        try {
            const updatedCompany = await this.prisma.company.update({
                where: {
                    id,
                    deleted: false,
                },
                data: {
                    ...update,
                    updated_at: new Date(),
                },
            });

            return Right.create(CompanyPresenter.toEntity(updatedCompany));
        } catch (error) {
            return Left.create(new ServerError(`Erro ao atualizar empresa: ${error.message}`));
        }
    }

    async delete(id: string): Promise<Either<ErrorBase, void>> {
        try {
            await this.prisma.company.update({
                where: {
                    id,
                    deleted: false,
                },
                data: {
                    deleted: true,
                },
            });

            return Right.create(undefined);
        } catch (error) {
            return Left.create(new ServerError(`Erro ao deletar empresa: ${error.message}`));
        }
    }
}
