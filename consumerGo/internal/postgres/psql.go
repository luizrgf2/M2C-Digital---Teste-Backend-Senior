package psql

import (
	"database/sql"
	"os"
	"sync"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var (
	instance *sql.DB
	once     sync.Once
)

func GetInstance() (*sql.DB, error) {
	var err error
	once.Do(func() {
		dbURL := os.Getenv("PSQL_URL")
		instance, err = sql.Open("pgx", dbURL)
		if err != nil {
			return
		}
		err = instance.Ping()
	})

	return instance, err
}
