import { Either, Left, Right } from "src/app/shared/either";
import { CompanyInvalidDocumentError, CompanyInvalidNameError } from "../errors/company";

export interface ICompany {
    id: string;
    name: string;
    document: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
}

export class CompanyEntity {
    private company: ICompany;

    constructor(company: ICompany) {
        this.company = company;
    }

    get id(): string {
        return this.company.id;
    }

    set id(id: string) {
        this.company.id = id;
    }

    get name(): string {
        return this.company.name;
    }

    set name(name: string) {
        this.company.name = name;
    }

    get document(): string {
        return this.company.document;
    }

    set document(document: string) {
        this.company.document = document;
    }

    get createdAt(): Date {
        return this.company.createdAt;
    }

    get updatedAt(): Date {
        return this.company.updatedAt;
    }

    get deleted(): boolean {
        return this.company.deleted;
    }

    set deleted(deleted: boolean) {
        this.company.deleted = deleted;
    }

    private isValidName(name: string): boolean {
        return name.length >= 4 && name.length <= 100;
    }

    private isValidDocument(document: string): boolean {
        return document.length >= 4 && document.length <= 400;
    }

    validate(): Either<Error, void> {
        if (!this.isValidName(this.company.name)) return Left.create(new CompanyInvalidNameError());
        if (!this.isValidDocument(this.company.document)) return Left.create(new CompanyInvalidDocumentError());

        return Right.create(undefined);
    }

    static create(company: ICompany): Either<Error, CompanyEntity> {
        const companyEntity = new CompanyEntity(company);
        const validation = companyEntity.validate();
        if (validation.left) return Left.create(validation.left);

        return Right.create(companyEntity);
    }

    static createWithoutId(company: Omit<ICompany, "id">): Either<Error, CompanyEntity> {
        return this.create({ ...company, id: "" });
    }
}
