import { IMessage } from "./message"

export interface MessagePropsProps {
    message: IMessage,
    userId: string,
    companyId: string
}

export interface MessageInfoQuantityProps {
    quantity: number;
    userId: string;
    companyId: string;
    campaignId: string;
}
