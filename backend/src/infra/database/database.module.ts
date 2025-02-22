import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UserRepository } from "./userRepositoryPrisma.service";
import { CompanyRepository } from "./companyRepository.service";
import { CampaignRepository } from "./campaignRepository.service";

@Module({
    providers: [PrismaService, UserRepository, CompanyRepository, CampaignRepository],
    exports: [PrismaService, UserRepository, CompanyRepository, CampaignRepository]
})
export class DatabaseModule {}