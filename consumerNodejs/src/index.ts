import { connectDb } from "./mongodb";
import * as dotenv from "dotenv"
dotenv.config()

import { MessageConsumerFactory } from "./rabbitMQ/messageConsumerFactory";


;(async ()=>{
    await connectDb()

    const consumer = MessageConsumerFactory.handle()
    await consumer.start()
})()