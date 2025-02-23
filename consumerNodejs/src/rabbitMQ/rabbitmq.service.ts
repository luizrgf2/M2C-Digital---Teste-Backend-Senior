import { connect, Connection, Channel } from 'amqplib';
import {createId} from "@paralleldrive/cuid2"

export interface MessageTemplateProps<T=any> {
  id: string;
  type: string;
  date: Date;
  payload: T;
}

export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;

  constructor(private readonly prefetch: number = 1) {}

  async connect() {
    this.connection = await connect(process.env.RABBIT_MQ_URL as string);
    this.channel = await this.connection.createChannel();
    console.log("Rabbit connected!")
  }

  async consumer(queueName: string, consumerFunc: (msg:MessageTemplateProps) => Promise<void>)  {
    this.channel.assertQueue(queueName, { durable: true })
    this.channel.prefetch(this.prefetch)
    this.channel.consume(queueName, async (msg)=>{
      if(!msg) return
      const message = JSON.parse(msg.content.toString()) as MessageTemplateProps
      try{
        await consumerFunc(message)
        this.channel.ack(msg)
      }catch(e){
        console.error("ERR_TO_CONSUME_MESSAGE")
        this.channel.nack(msg, undefined, true)
      }

    },{noAck: false})

    console.log(`consuming ${queueName}`)

  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}
