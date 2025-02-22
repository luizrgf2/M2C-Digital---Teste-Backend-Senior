import { MessageEntity } from "src/core/domain/entities/message";
import { Either } from "src/core/shared/either";
import { ErrorBase } from "src/core/shared/errorBase";


export interface MessagePropsProps {
    message: MessageEntity,
    userId: string,
    companyId: string
}

export interface IMessageProducerService {
    sendToQueue(message: MessagePropsProps): Promise<Either<ErrorBase, void>>
}