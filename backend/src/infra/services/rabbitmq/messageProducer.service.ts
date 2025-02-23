import { Injectable } from '@nestjs/common';
import { IMessageProducerService, MessageInfoQuantityProps, MessagePropsProps } from 'src/core/data/interfaces/services/messageProducer';
import { ErrorBase } from 'src/core/shared/errorBase';
import { RabbitMQService } from './rabbitmq.service';
import { Either, Left, Right } from 'src/core/shared/either';
import { ServerError } from 'src/errors/general';

@Injectable()
export class MessageProducerService implements IMessageProducerService {
  constructor(private readonly rabbitMQService: RabbitMQService) {
    this.rabbitMQService.connect();
  }

  async sendMessageQuantityToQueue(messageQuantityInfo: MessageInfoQuantityProps): Promise<Either<ErrorBase, void>> {
    try {
      await this.rabbitMQService.sendToQueue(process.env.MESSAGE_QUEUE_NAME as string, messageQuantityInfo, "message_quantity_info");
      return Right.create(undefined)
    } catch (error) {
      return Left.create(new ServerError("Erro para processar mensagem!"))
    }
  }

  async sendMessageToQueue(messageProps: MessagePropsProps): Promise<Either<ErrorBase, void>> {
    try {

      const {companyId, message, userId} = messageProps

      const toSend = {
        ...message.returnJson(),
        companyId,
        userId
      }
      await this.rabbitMQService.sendToQueue(process.env.MESSAGE_QUEUE_NAME as string, toSend, "message");
      return Right.create(undefined)
    } catch (error) {
      return Left.create(new ServerError("Erro para processar mensagem!"))
    }
  }

}
