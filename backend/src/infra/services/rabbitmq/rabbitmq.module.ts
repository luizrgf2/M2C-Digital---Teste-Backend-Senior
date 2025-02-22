import { Module } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";
import { MessageProducerService } from "./messageProducer.service";

@Module({
    providers: [RabbitMQService, MessageProducerService],
    exports: [RabbitMQService, MessageProducerService]
})
export class RabbitMqModule {}