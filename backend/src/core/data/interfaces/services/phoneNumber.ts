import { Either } from "src/core/shared/either";
import { ErrorBase } from "src/core/shared/errorBase";

export interface IPhoneNumberService {
    getNumbers(userId: string, companyId: string, campaignId: string): Promise<Either<ErrorBase, string[]>>
}