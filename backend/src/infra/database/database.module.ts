import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UserRepository } from "./userRepositoryPrisma.service";
import { CompanyRepository } from "./companyRepository.service";

@Module({
    providers: [PrismaService, UserRepository, CompanyRepository],
    exports: [PrismaService, UserRepository, CompanyRepository]
})
export class DatabaseModule {}