use redis::AsyncCommands;
use tokio_postgres::Client;
use std::{collections::HashMap, error::Error};

use crate::{interfaces, mongo};


pub struct MessageConsumerService {
    pub redis_client: redis::aio::MultiplexedConnection,
    pub postgres_client: Client,
    pub tasks_run: HashMap<String, i32>,
    pub monogo_db: mongodb::Client
}

impl MessageConsumerService {
    fn create_key_total_items(user_id: &str, company_id: &str, campaign_id: &str) -> String {
        format!("{}:{}:{}:total_items", user_id, company_id, campaign_id)
    }

    fn create_key_count_items(user_id: &str, company_id: &str, campaign_id: &str) -> String {
        format!("{}:{}:{}:count_items", user_id, company_id, campaign_id)
    }

    async fn sum_count_in_cache(&mut self, key: &str) -> Result<(), Box<dyn Error>> {
        let _: () = self.redis_client.incr(key, 1).await?;
        Ok(())
    }

    async fn finalize_campaign(&self, campaign_id: &str) -> Result<(), Box<dyn Error>>  {
        let query = "UPDATE campaigns SET finalized = TRUE WHERE id = $1";
        self.postgres_client.execute(query, &[&campaign_id]).await?;
        println!("Campanha {} finalizada com sucesso!", campaign_id);
        Ok(())
    }

    async fn check_if_finalized(&mut self, user_id: &str, company_id: &str, campaign_id: &str, key_count_items: &str) -> Result<(), Box<dyn Error>>  {
        let key_total_items = Self::create_key_total_items(user_id, company_id, campaign_id);
        
        let total_itens_cached  = self.tasks_run.get(&key_total_items);
        let total_items: i32;

        if total_itens_cached.is_some() {
            total_items = total_itens_cached.unwrap().to_owned();
        }else{
            total_items = self.redis_client.get(&key_total_items).await.unwrap_or(0);
        }

        let current_count_items = self.redis_client.get(&key_count_items).await.unwrap_or(0);
        
        println!("{}/{}", current_count_items, total_items);
        
        if current_count_items == total_items {
            self.finalize_campaign(campaign_id).await?;
        };
        Ok(())
    }

    pub async fn consume(&mut self, msg: interfaces::MessageTemplateProps) -> Result<(),Box<dyn Error>>{
        if msg.type_message == "message_quantity_info" {
            let message: interfaces::MessageInfoQuantityProps = serde_json::from_value(msg.payload.clone())?;
            let key = Self::create_key_total_items(&message.userId, &message.companyId, &message.campaignId);
            let _: () = self.redis_client.set(&key, message.quantity).await?;
            self.tasks_run.insert(key, message.quantity.try_into()?);
        }

        if msg.type_message == "message" {
            let message: interfaces::IMessage = serde_json::from_value(msg.payload.clone())?;
            let key = Self::create_key_count_items(&message.userId, &message.companyId, &message.campaignId);
            
            let message_id = mongo::insert_document(&self.monogo_db, "mydb", "messages", &message).await?;
            
            println!("Mensagem salva com ID: {}", message_id);

            self.sum_count_in_cache(&key).await?;
            self.check_if_finalized(&message.userId, &message.companyId, &message.campaignId, &key).await?;
        };
        Ok(())
    }

}