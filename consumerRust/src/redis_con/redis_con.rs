use std::{env, error::Error};



pub async fn get_redis_client() -> Result<redis::aio::MultiplexedConnection, Box<dyn Error>> {
    let connection = redis::Client::open(env::var("REDIS_URL").unwrap())?;
    let to_return = redis::Client::get_multiplexed_async_connection(&connection).await?;
    Ok(to_return)
}