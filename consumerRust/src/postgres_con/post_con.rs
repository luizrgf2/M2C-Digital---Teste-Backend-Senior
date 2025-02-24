use url::Url;
use std::{env, error::Error};
use tokio_postgres::{NoTls, Client};


fn parse_postgres_url() -> Result<String, Box<dyn Error>> {
    let url = &env::var("PSQL_URL")?;

    let url = Url::parse(url)?;

    let host = url.host_str().ok_or("Host não encontrado")?;
    let port = url.port().unwrap_or(5432); 
    let user = url.username();
    let password = url.password().unwrap_or("");
    let dbname = url.path().trim_start_matches('/');

    let connection_string = format!(
        "host={} port={} user={} password={} dbname={}",
        host, port, user, password, dbname
    );

    Ok(connection_string)
}

pub async fn get_pg_client() -> Result<Client, Box<dyn Error>> {

    let url = parse_postgres_url()?;

    let (client, connection) = tokio_postgres::connect(&url, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Erro na conexão com o banco: {}", e);
        }
    });

    Ok(client)
}
