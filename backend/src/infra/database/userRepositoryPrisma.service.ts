import { Injectable } from '@nestjs/common';
import { Either, Left, Right } from 'src/core/shared/either';
import { UserEntity } from 'src/core/domain/entities/user';
import { PrismaService } from './prisma.service';
import { IUserRepository, UpdateUserProps } from 'src/core/data/interfaces/repositories/user';
import { NotExistsError } from 'src/core/data/errors/general';
import { UserPresenter } from '../presenters/userPersenter.service';
import { ServerError } from 'src/errors/general';
import { ErrorBase } from 'src/core/shared/errorBase';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(user: UserEntity): Promise<Either<ErrorBase, UserEntity>> {
        try {
            const createdUser = await this.prisma.user.create({
                data: {
                    id: createId(),
                    email: user.email,
                    password: user.password,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt,
                    deleted: false,
                },
            });
            return Right.create(UserPresenter.toEntity(createdUser));
        } catch (error) {
            return Left.create(new ServerError(`Erro ao criar usuário`));
        }
    }

    async findById(id: string): Promise<Either<ErrorBase, UserEntity>> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id,
                    deleted: false,
                },
            });
            if (!user) {
                return Left.create(new NotExistsError());
            }
            return Right.create(UserPresenter.toEntity(user));
        } catch (error) {
            return Left.create(new ServerError(`Erro ao buscar usuário por ID`));
        }
    }

    async findByEmail(email: string): Promise<Either<ErrorBase, UserEntity>> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                    deleted: false,
                },
            });
            if (!user) {
                return Left.create(new NotExistsError());
            }
            return Right.create(UserPresenter.toEntity(user));
        } catch (error) {
            return Left.create(new ServerError(`Erro ao buscar usuário por e-mail`));
        }
    }

    async update(id: string, update: UpdateUserProps): Promise<Either<ErrorBase, UserEntity>> {
        try {
            const updatedUser = await this.prisma.user.update({
                where: {
                    id,
                    deleted: false,
                },
                data: {
                    ...update,
                    updated_at: new Date(),
                },
            });
            return Right.create(UserPresenter.toEntity(updatedUser));
        } catch (error) {
            return Left.create(new ServerError(`Erro ao atualizar usuário`));
        }
    }

    async delete(id: string): Promise<Either<ErrorBase, void>> {
        try {
            await this.prisma.user.update({
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
            return Left.create(new ServerError(`Erro ao deletar usuário`));
        }
    }
}
