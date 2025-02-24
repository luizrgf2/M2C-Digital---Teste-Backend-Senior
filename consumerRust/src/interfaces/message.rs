use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct MessageTemplateProps {
    pub id: String,
    pub type_message: String,
    pub date: String,
    pub payload: serde_json::Value
}
#[derive(Serialize, Deserialize, Debug)]
pub struct  MessagePropsProps {
    pub message: IMessage,
    pub userId: String,
    pub companyId: String
}
#[derive(Serialize, Deserialize, Debug)]
pub struct  MessageInfoQuantityProps {
    pub quantity: i64,
    pub userId: String,
    pub companyId: String,
    pub campaignId: String,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct  IMessage {
    pub id: String,
    pub phoneNumber: String,
    pub message: String,
    pub campaignId: String,
    pub userId: String,
    pub companyId: String,
    pub createdAt: String,
    pub updatedAt: String,
    pub deleted: bool,
}