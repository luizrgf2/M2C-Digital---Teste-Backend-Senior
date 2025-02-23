import { MessageModel } from "../model/message";
import { MessageTemplateProps, RabbitMQService } from "./rabbitmq.service";
import { IMessage } from "../interfaces/messages/message";
import { createId } from "@paralleldrive/cuid2";
import { RedisClientType } from "@redis/client";
import { MessageInfoQuantityProps } from "src/interfaces/messages/messageConsumerProps";
import  { PSQL } from "../postgress/psql";


const tasksRun = {}

export class MessageConsumerService {
    constructor(private readonly rabbitMqService: RabbitMQService, private readonly redis: RedisClientType, private readonly psql: PSQL) {}

    private createKeyTotalItens(userId: string, companyId: string, campaignId: string) {
        return `${userId}:${companyId}:${campaignId}:total_itens`
    }

    private createKeyCountItens(userId: string, companyId: string, campaignId: string) {
        return `${userId}:${companyId}:${campaignId}:count_itens`
    }

    private async sumCountInCache(key: string) {
        await this.redis.incr(key)
    }

    async  finalizeCampaign(campaignId: string) {
        try {
            const query = 'UPDATE campaigns SET finalized = true WHERE id = $1';
            await this.psql.query(query, [campaignId]);
            console.log(`Campanha ${campaignId} finalizada com sucesso!`);
        } catch (error) {
            console.error('Erro ao finalizar a campanha:', error);
        }
      }

    private async checkIfFinalized(userId: string, companyId: string, campaignId: string) {
        const keyTotalItens =  this.createKeyTotalItens(userId, companyId, campaignId)
        const keyCountItens = this.createKeyCountItens(userId, companyId, campaignId)

        let totalItens = tasksRun[keyTotalItens] 
        if(!totalItens){
            totalItens = await this.redis.get(keyTotalItens)
            totalItens = totalItens ? Number(totalItens) : 0
        }
        
        const curretCountItensCached = await this.redis.get(keyCountItens)
        const curretCountItens = curretCountItensCached ? Number(curretCountItensCached) : undefined

        console.log(`${curretCountItens}/${totalItens}`)
        if(curretCountItens === totalItens) {
            await this.finalizeCampaign(campaignId)
        }
    
    }

    private async consumer(msg: MessageTemplateProps) {
        
        if(msg.type === "message_quantity_info") {
            const message = msg.payload as MessageInfoQuantityProps
            const key =  this.createKeyTotalItens(message.userId, message.companyId, message.campaignId)
            await this.redis.set(key, message.quantity)
            tasksRun[key] = message.quantity
        }

        if(msg.type === "message") {
            const message = msg.payload as IMessage

            const key =  this.createKeyCountItens(message.userId, message.companyId, message.campaignId)
            
            const createMessageOrError = await MessageModel.insertOne({
                campaign_id: message.campaignId,
                created_at: new Date(),
                updated_at: new Date(),
                deleted: false,
                phone_number: message.phoneNumber,
                message: message.message,
                identifier: createId()
            })
            await this.sumCountInCache(key)
            await this.checkIfFinalized(message.userId, message.companyId, message.campaignId)
        }
    }

    async start() {
        await this.rabbitMqService.connect()
        await this.rabbitMqService.consumer(process.env.MESSAGE_QUEUE_NAME as string, (msg)=>this.consumer(msg))
    }
}