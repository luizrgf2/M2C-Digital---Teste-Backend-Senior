import { Either, Left, Right } from "src/app/shared/either";
import { MessageInvalidPhoneNumberError, MessageInvalidContentLengthError } from "../errors/message";

export interface IMessage {
    id: string;
    phoneNumber: string;
    message: string;
    campaignId: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
}

export class MessageEntity {
    private message: IMessage;

    constructor(message: IMessage) {
        this.message = message;
    }

    get id(): string {
        return this.message.id;
    }

    set id(id: string) {
        this.message.id = id;
    }

    get phoneNumber(): string {
        return this.message.phoneNumber;
    }

    set phoneNumber(phoneNumber: string) {
        this.message.phoneNumber = phoneNumber;
    }

    get messageText(): string {
        return this.message.message;
    }

    set messageText(message: string) {
        this.message.message = message;
    }

    get campaignId(): string {
        return this.message.campaignId;
    }

    set campaignId(campaignId: string) {
        this.message.campaignId = campaignId;
    }

    get createdAt(): Date {
        return this.message.createdAt;
    }

    set createdAt(createdAt: Date) {
        this.message.createdAt = createdAt;
    }

    get updatedAt(): Date {
        return this.message.updatedAt;
    }

    set updatedAt(updatedAt: Date) {
        this.message.updatedAt = updatedAt;
    }

    get deleted(): boolean {
        return this.message.deleted;
    }

    set deleted(deleted: boolean) {
        this.message.deleted = deleted;
    }

    private isValidPhoneNumber(): boolean {
        const cleanPhoneNumber = this.message.phoneNumber.replace(/\D/g, "");
        return cleanPhoneNumber.length === 10 || cleanPhoneNumber.length === 11;
    }

    private isValidMessageLength(): boolean {
        return this.message.message.length >= 10 && this.message.message.length <= 400;
    }

    validate(): Either<Error, void> {
        if (!this.isValidPhoneNumber()) return Left.create(new MessageInvalidPhoneNumberError());
        if (!this.isValidMessageLength()) return Left.create(new MessageInvalidContentLengthError());

        return Right.create(undefined);
    }

    static create(message: IMessage): Either<Error, MessageEntity> {
        const messageEntity = new MessageEntity(message);
        const validation = messageEntity.validate();
        if (validation.left) return Left.create(validation.left);

        return Right.create(messageEntity);
    }

    static createWithoutId(message: Omit<IMessage, "id">): Either<Error, MessageEntity> {
        return this.create({ ...message, id: "" });
    }
}
