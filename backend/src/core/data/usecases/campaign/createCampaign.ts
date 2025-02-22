import { Either, Left, Right } from "src/core/shared/either";
import { ICampaignRepository } from "../../interfaces/repositories/campaign";
import { CampaignEntity } from "src/core/domain/entities/campaign";
import { ErrorBase } from "src/core/shared/errorBase";
import { IMessageProducerService } from "../../interfaces/services/messageProducer";
import { MessageEntity } from "src/core/domain/entities/message";

export interface CreateCampaignUseCaseInput {
    name: string;
    userId: string;
    companyId: string;
    message: string;
    listNumbers: string
}

export interface CreateCampaignUseCaseOutput {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateCampaignUseCase {
    constructor(
        private readonly campaignRepository: ICampaignRepository,
        private readonly messageProducer: IMessageProducerService
    ) {}

    private createCampaignEntity(input: CreateCampaignUseCaseInput): Either<ErrorBase, CampaignEntity> {
        const now = new Date();
        const campaign = CampaignEntity.createWithoutId({ ...input, createdAt: now, updatedAt: now, deleted: false, finalized: false});
        return campaign;
    }

    createMessageToSend(message: string, campaignId: string,  phoneNumber: string): Either<ErrorBase, MessageEntity> {
        const now = new Date()
        const messageToSend = MessageEntity.create({
            campaignId: campaignId,
            createdAt: now,
            deleted: false,
            id: "",
            message: message,
            phoneNumber: phoneNumber,
            updatedAt: now
        })
        if(messageToSend.left) return Left.create(messageToSend.left)
        return Right.create(messageToSend.right)
    }

    async sendMessageToQueue(messageToSend: MessageEntity, companyId: string, userId: string): Promise<Either<ErrorBase, void>> {
        return await this.messageProducer.sendToQueue({
            companyId: companyId,
            message: messageToSend,
            userId: userId
        })
    }

    loadPhoneNumbersByListNumbersText(listNumbersText: string): string[] {
        const numbers = listNumbersText.split("\n")
        numbers.pop()
        return numbers
    }

    async exec(input: CreateCampaignUseCaseInput): Promise<Either<ErrorBase, CreateCampaignUseCaseOutput>> {
        const createCampaignEntityOrError = this.createCampaignEntity(input);
        if (createCampaignEntityOrError.left) return Left.create(createCampaignEntityOrError.left);

        const saveCampaignOrError = await this.campaignRepository.create(createCampaignEntityOrError.right);
        if (saveCampaignOrError.left) return Left.create(saveCampaignOrError.left);

        const numbersToSendToQueue = this.loadPhoneNumbersByListNumbersText(input.listNumbers)

        for(const phoneNumber of numbersToSendToQueue) {
            const messageToSendOrError = this.createMessageToSend(input.message, saveCampaignOrError.right.id, phoneNumber)
            if(messageToSendOrError.left) continue
            const sendMessageToQueueOrError = await this.sendMessageToQueue(messageToSendOrError.right, input.companyId, input.userId)
            if(sendMessageToQueueOrError.left) return Left.create(sendMessageToQueueOrError.left)
        }

        return Right.create({
            id: saveCampaignOrError.right.id,
            name: saveCampaignOrError.right.name,
            createdAt: saveCampaignOrError.right.createdAt,
            updatedAt: saveCampaignOrError.right.updatedAt
        });
    }
}
