use std::{collections::HashMap, error::Error};

use crate::{mongo::get_mongo_client, postgres_con::get_pg_client, redis_con::get_redis_client};

use super::{MessageConsumerService, RabbitMqService};

pub async fn create_message_consumer() -> Result<RabbitMqService, Box<dyn Error>>{

    let mongo_db_con = get_mongo_client().await;
    let postgres_db_con  = get_pg_client().await.expect("db error");
    let redis_cache_conn = get_redis_client().await?;
    let task_run = HashMap::new();

    let message_consumer_service = MessageConsumerService {
        monogo_db: mongo_db_con,
        postgres_client: postgres_db_con,
        redis_client: redis_cache_conn,
        tasks_run: task_run,
    };

    let rabbit_mq_service = RabbitMqService::new(message_consumer_service).await?;
    Ok(rabbit_mq_service)
}