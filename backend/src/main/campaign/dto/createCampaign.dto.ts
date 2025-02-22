import { IsNotEmpty, IsString } from "class-validator";

export class CreateCampaignDto {
    @IsNotEmpty()
    @IsString()
    name: string
    @IsNotEmpty()
    @IsString()
    companyId: string;
    @IsNotEmpty()
    @IsString()
    message: string;
}
