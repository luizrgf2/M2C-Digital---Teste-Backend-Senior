import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UserRepository } from "./userRepositoryPrisma.service";

@Module({
    providers: [PrismaService, UserRepository],
    exports: [PrismaService, UserRepository]
})
export class DatabaseModule {}