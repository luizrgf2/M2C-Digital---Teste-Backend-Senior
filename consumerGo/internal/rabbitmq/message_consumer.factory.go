package rabbitmq

import (
	"time"

	"github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/mongo"
	"github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/mongo/repository"
	psql "github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/postgres"
	rds "github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/redis"
)

func NewMessageConsumerServiceFactory() *MessageConsumerService {

	rabbitMqService := RabbiMQService{}
	rabbitMqService.Connect()
	redisClient := rds.GetRedisInstance()
	postgres, err := psql.GetInstance()
	if err != nil {
		panic(err)
	}
	mongodb, err := mongo.GetInstance()
	if err != nil {
		panic(err)
	}

	repositoryMessage := repository.NewMessageRepository(mongodb)

	time.Sleep(time.Duration(time.Second * 10))

	return NewMessageConsumerService(&rabbitMqService, redisClient, postgres, repositoryMessage)
}
