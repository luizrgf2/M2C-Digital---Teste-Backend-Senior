export interface IMessage {
    id: string;
    phoneNumber: string;
    message: string;
    campaignId: string;
    userId: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
}