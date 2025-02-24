use std::{env, error::Error};

use mongodb::{bson, options::ClientOptions, Client};
use cuid2;

use crate::interfaces;



pub async  fn get_mongo_client() -> Client {
    let client_options = ClientOptions::parse(env::var("DATABASE_URL").unwrap()).await.unwrap();
    let client = Client::with_options(client_options).unwrap();
    client
}

pub async fn insert_document(client: &Client, db_name: &str, coll_name: &str, model: &interfaces::IMessage) -> Result<String, Box<dyn Error>>{
    let id = cuid2::create_id();
    let bson_now: bson::DateTime =  bson::DateTime::now();
    let db = client.database(db_name);
    let coll = db.collection(coll_name);
    let doc = bson::doc! { 
        "identifier": &id,
        "phone_number": &model.phoneNumber,
        "message": &model.message,
        "campaign_id": &model.campaignId,
        "created_at": bson_now,
        "updated_at": bson_now,
        "deleted": false,
    };

    coll.insert_one(doc).await?;
    Ok(id)
}