mod rabbitmq;
mod interfaces;
mod redis_con;
mod mongo;
mod postgres_con;

use std::env;

use dotenvy::dotenv;
use rabbitmq::create_message_consumer;



#[tokio::main]
async fn main() {
    dotenv().ok();

    let mut rabbit_mq_service = create_message_consumer().await.unwrap();
    rabbit_mq_service.consumer(&env::var("MESSAGE_QUEUE_NAME").unwrap()).await.unwrap();

}
