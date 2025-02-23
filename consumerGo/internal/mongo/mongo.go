package mongo

import (
	"context"
	"log"
	"os"
	"sync"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	instance *mongo.Client
	once     sync.Once
)

func GetInstance() (*mongo.Client, error) {
	var err error
	once.Do(func() {
		err = godotenv.Load()
		if err != nil {
			log.Fatal("Erro ao carregar o arquivo .env:", err)
		}

		mongoURI := os.Getenv("DATABASE_URL")
		if mongoURI == "" {
			log.Fatal("A variável MONGODB_URI não está definida")
		}

		clientOptions := options.Client().ApplyURI(mongoURI)
		instance, err = mongo.Connect(context.Background(), clientOptions)
		if err != nil {
			return
		}

		err = instance.Ping(context.Background(), nil)
	})

	return instance, err
}
