import { connectDb } from "./mongodb";
import { MessageConsumerFactory } from "./rabbitMQ/messageConsumerFactory";
import * as dotenv from "dotenv"

dotenv.config()


;(async ()=>{
    await connectDb()

    const consumer = MessageConsumerFactory.handle()
    await consumer.start()
})()