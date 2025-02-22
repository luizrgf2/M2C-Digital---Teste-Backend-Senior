import { IsNotEmpty, IsString } from "class-validator";

export class CreateCampaignDto {
    @IsNotEmpty()
    @IsString()
    name: string
}
