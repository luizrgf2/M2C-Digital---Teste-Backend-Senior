import { Either, Left, Right } from "src/core/shared/either";
import { ICompanyRepository } from "../../interfaces/repositories/company";
import { ErrorBase } from "src/core/shared/errorBase";
import { NotExistsError } from "../../errors/general";

export interface DeleteCompanyUseCaseInput {
    id: string;
}

export class DeleteCompanyUseCase {
    constructor(private readonly companyRepository: ICompanyRepository) {}

    async exec(input: DeleteCompanyUseCaseInput): Promise<Either<ErrorBase, void>> {
        const companyOrError = await this.companyRepository.findById(input.id);
        if (companyOrError.left) return Left.create(new NotExistsError());

        const deleteOrError = await this.companyRepository.delete(input.id);
        if (deleteOrError.left) return Left.create(deleteOrError.left);

        return Right.create(undefined);
    }
}
