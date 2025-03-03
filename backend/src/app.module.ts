import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './main/users/users.module';
import { AuthenticationModule } from './main/authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './main/authentication/authentication.guard';
import { CompanyModule } from './main/company/company.module';
import { CampaignModule } from './main/campaign/campaign.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }), 
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecret',
    }),
    UsersModule, 
    AuthenticationModule,
    CompanyModule,
    CampaignModule,
],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule {}
