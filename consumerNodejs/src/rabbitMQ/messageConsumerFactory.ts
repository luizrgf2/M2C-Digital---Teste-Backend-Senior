import {PSQLInstance} from "../postgress/psql";
import RedisSingleton from "../redis/redisConn";
import { MessageConsumerService } from "./messageConsumer.service";
import { RabbitMQService } from "./rabbitmq.service";

export class MessageConsumerFactory {
    static handle() {
        const serviceToMessage = new RabbitMQService()
        const service3 = RedisSingleton.getInstance()
        const messageConsumer = new MessageConsumerService(serviceToMessage, service3, PSQLInstance)
        return messageConsumer
    }
}