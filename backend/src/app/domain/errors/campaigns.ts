import { ErrorBase } from "src/app/shared/errorBase";

export class CampaignInvalidNameError extends ErrorBase {
    constructor(minLength: number = 4, maxLength: number = 100) {
        super(`O nome da campanha deve ter entre ${minLength} e ${maxLength} caracteres`, 400);
    }
}