import { MessageEntity } from "src/core/domain/entities/message";
import { Either } from "src/core/shared/either";
import { ErrorBase } from "src/core/shared/errorBase";


export interface MessagePropsProps {
    message: MessageEntity;
    userId: string;
    companyId: string
}

export interface MessageInfoQuantityProps {
    quantity: number;
    userId: string;
    companyId: string;
    campaignId: string;
}

export interface IMessageProducerService {
    sendMessageToQueue(message: MessagePropsProps): Promise<Either<ErrorBase, void>>
    sendMessageQuantityToQueue(message: MessageInfoQuantityProps): Promise<Either<ErrorBase, void>>
}