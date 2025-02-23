import { Pool } from 'pg';

export class PSQL {
    private static instance: PSQL;
    private pool: Pool;



    private constructor() {

        const credentials = this.parsePostgresUrl()

        this.pool = new Pool({
            host: credentials.host,
            port: credentials.port,
            user: credentials.user,
            password: credentials.password,
            database: credentials.database
        });

        this.pool.on('connect', () => {
            console.log('Conectado ao PostgreSQL');
        });

        this.pool.on('error', (err) => {
            console.error('Erro na conexão com o PostgreSQL:', err);
        });
    }

    private parsePostgresUrl() {
        const url = new URL(process.env.PSQL_URL as string);
    
        return {
        user: url.username,
        password: url.password,
        host: url.hostname,
        port: Number(url.port) || 5432,
        database: url.pathname.replace('/', ''),
        };
    }
  
    public static getInstance(): PSQL {
        if (!PSQL.instance) {
        PSQL.instance = new PSQL();
        }
        return PSQL.instance;
    }

    public async query(text: string, params?: any[]): Promise<any> {
        const client = await this.pool.connect();
        try {
        const res = await client.query(text, params);
        return res.rows;
        } finally {
        client.release();
        }
    }
}

export const PSQLInstance =  PSQL.getInstance();
