import { Injectable } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;

  async connect() {
    this.connection = await connect(process.env.RABBIT_MQ_URL);
    this.channel = await this.connection.createChannel();
  }

  async sendToQueue(queue: string, message: any) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}
