use std::{ env, error::Error};
use futures_util::stream::StreamExt;

use lapin::{options::{BasicAckOptions, BasicConsumeOptions, BasicNackOptions, QueueDeclareOptions}, types::FieldTable, ConnectionProperties};

use crate::interfaces::MessageTemplateProps;

use super::MessageConsumerService;

pub struct RabbitMqService {
    channel: lapin::Channel,
    message_consumer_service: MessageConsumerService
}

impl RabbitMqService {
    pub async fn new(message_consumer: MessageConsumerService) -> Result<RabbitMqService, Box<dyn Error>> {
        
        let rabbit_url = env::var("RABBIT_MQ_URL").unwrap();

        let con = lapin::Connection::connect(&rabbit_url, ConnectionProperties::default()).await?;
        let ch = con.create_channel().await?;

        let rabbit = RabbitMqService {
            channel: ch,
            message_consumer_service: message_consumer
        };

        Ok(rabbit)
    }

    pub async  fn consumer(&mut self, queue_name: &str) -> Result<(),Box<dyn Error>> {
        let options = QueueDeclareOptions {
            auto_delete: false,
            durable: true,
            exclusive: false,
            ..Default::default()
        };

        let options_consumer = BasicConsumeOptions{
            exclusive: false,
            no_ack: false,
            no_local: false,
            nowait: false
        };

        let queue = self.channel
        .queue_declare(queue_name, options, FieldTable::default())
        .await?;
    
        let mut consumer = self.channel
            .basic_consume(
                queue.name().as_str(),
                "my_consumer",
                options_consumer,
                FieldTable::default(),
            )
            .await?;
        
        while let Some(delivery) = consumer.next().await {
            if let Ok(delivery) = delivery {
                    let body = String::from_utf8_lossy(&delivery.data);
                   
                    let new_body = body.replace("\"type\"", "\"type_message\"");
                    
                    let message_to_save: MessageTemplateProps = serde_json::from_str(&new_body)?;
                    let res = self.message_consumer_service.consume(message_to_save).await;

                    if let Err(err) = res {
                        delivery.nack(BasicNackOptions{
                            multiple: false,
                            requeue: true
                        }).await?;
                        println!("{}", err.to_string());
                    }

                    delivery.ack(BasicAckOptions::default()).await?;
            };

        }

        /*for (i, message) in consumer.receiver().iter().enumerate() {
            match message {
                ConsumerMessage::Delivery(delivery) => {
                    let body = String::from_utf8_lossy(&delivery.body);
                    println!("({:>3}) Received [{}]", i, body);
                   
                    let new_body = body.replace("\"type\"", "\"type_message\"");
                    
                    let message_to_save: MessageTemplateProps = serde_json::from_str(&new_body)?;
                    let res = self.message_consumer_service.consume(message_to_save).await;

                    if let Err(err) = res {
                        consumer.nack(delivery.clone(), true)?;
                        println!("{}", err.to_string());
                    }

                    consumer.ack(delivery)?;
                }
                other => {
                    println!("Consumer ended: {:?}", other);
                    break;
                }
            }
        };*/
    
        Ok(())

    }
}