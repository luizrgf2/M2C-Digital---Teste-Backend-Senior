import { Injectable } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import {createId} from "@paralleldrive/cuid2"

export interface MessageTemplateProps<T=any> {
  id: string;
  type: "message";
  date: Date;
  payload: T;
}

@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;

  async connect() {
    this.connection = await connect(process.env.RABBIT_MQ_URL);
    this.channel = await this.connection.createChannel();
  }

  async sendToQueue(queue: string, message: any) {

    const messageToSend = {
      id: createId(),
      date: new Date(),
      payload: message,
      type: "message"
    } as MessageTemplateProps

    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageToSend)), {
      persistent: true,
    });
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}
