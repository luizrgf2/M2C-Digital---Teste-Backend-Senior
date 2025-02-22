import { Injectable } from '@nestjs/common';
import { IMessageProducerService, MessagePropsProps } from 'src/core/data/interfaces/services/messageProducer';
import { ErrorBase } from 'src/core/shared/errorBase';
import { RabbitMQService } from './rabbitmq.service';
import { Either, Left, Right } from 'src/core/shared/either';
import { ServerError } from 'src/errors/general';

@Injectable()
export class MessageProducerService implements IMessageProducerService {
  constructor(private readonly rabbitMQService: RabbitMQService) {
    this.rabbitMQService.connect();
  }

  async sendToQueue(messageProps: MessagePropsProps): Promise<Either<ErrorBase, void>> {
    try {
      const { message, userId, companyId } = messageProps;
      const messageToSend = {
        ...message,
        userId,
        companyId,
      };

      await this.rabbitMQService.sendToQueue(process.env.MESSAGE_QUEUE_NAME as string, messageToSend);
      return Right.create(undefined)
    } catch (error) {
      return Left.create(new ServerError("Erro para processar mensagem!"))
    }
  }
}
