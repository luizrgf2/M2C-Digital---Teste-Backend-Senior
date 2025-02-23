package rabbitmq

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/interfaces"
	"github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/mongo/models"
	"github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/mongo/repository"
	"github.com/redis/go-redis/v9"
	"golang.org/x/net/context"
)

type MessageConsumerService struct {
	rabbitMQService *RabbiMQService
	redis           *redis.Client
	psql            *sql.DB
	mongoDb         *repository.MessageRepository
	tasksRun        map[string]int
}

func NewMessageConsumerService(rabbitMQService *RabbiMQService, redis *redis.Client, psql *sql.DB, mongoDB *repository.MessageRepository) *MessageConsumerService {
	return &MessageConsumerService{
		rabbitMQService: rabbitMQService,
		redis:           redis,
		psql:            psql,
		mongoDb:         mongoDB,
		tasksRun:        make(map[string]int),
	}
}

func (m *MessageConsumerService) createKeyTotalItems(userId, companyId, campaignId string) string {
	return fmt.Sprintf("%s:%s:%s:total_items", userId, companyId, campaignId)
}

func (m *MessageConsumerService) createKeyCountItems(userId, companyId, campaignId string) string {
	return fmt.Sprintf("%s:%s:%s:count_items", userId, companyId, campaignId)
}

func (m *MessageConsumerService) sumCountInCache(ctx context.Context, key string) error {
	return m.redis.Incr(ctx, key).Err()
}

func (m *MessageConsumerService) finalizeCampaign(campaignId string) error {
	query := "UPDATE campaigns SET finalized = true WHERE id = $1"
	_, err := m.psql.Exec(query, campaignId)
	if err != nil {
		log.Printf("Erro ao atualizar campanha com ID %s: %v", campaignId, err)
		return err
	}
	fmt.Printf("Campanha finalizada com sucesso %s", campaignId)

	return nil
}

func (m *MessageConsumerService) checkIfFinalized(ctx context.Context, userId, companyId, campaignId string) {
	totalKey := m.createKeyTotalItems(userId, companyId, campaignId)
	countKey := m.createKeyCountItems(userId, companyId, campaignId)

	totalItems, ok := m.tasksRun[totalKey]
	if !ok {
		totalStr, err := m.redis.Get(ctx, totalKey).Result()
		if err == nil {
			totalItems = int(totalStr[0])
		}
	}

	currentCount, _ := m.redis.Get(ctx, countKey).Int()

	fmt.Printf("%d/%d\n", currentCount, totalItems)
	if currentCount == totalItems {
		err := m.finalizeCampaign(campaignId)
		if err != nil {
			log.Printf("Erro ao finalizar campanha com ID %s: %v", campaignId, err)
		}
	}
}

func (m *MessageConsumerService) consumer(ctx context.Context, msg *interfaces.MessageTemplateProps[any]) error {
	switch msg.Type {
	case "message_quantity_info":
		var payload interfaces.MessageInfoQuantityProps
		data, _ := json.Marshal(msg.Payload)
		json.Unmarshal(data, &payload)
		key := m.createKeyTotalItems(payload.UserId, payload.CompanyId, payload.CampaignId)
		m.redis.Set(ctx, key, payload.Quantity, time.Duration(time.Hour*1))
		m.tasksRun[key] = payload.Quantity

	case "message":
		var payload interfaces.IMessage
		data, _ := json.Marshal(msg.Payload)
		json.Unmarshal(data, &payload)
		key := m.createKeyCountItems(payload.UserId, payload.CompanyId, payload.CampaignId)

		messageToSave := models.Message{
			PhoneNumber: payload.PhoneNumber,
			Message:     payload.Message,
			CampaignID:  payload.CampaignId,
			Deleted:     false,
		}

		messageCreated, err := m.mongoDb.Create(&messageToSave)
		if err != nil {
			return err
		}

		fmt.Printf("Mensagem armazenada com ID: %s\n", messageCreated)

		m.sumCountInCache(ctx, key)
		m.checkIfFinalized(ctx, payload.UserId, payload.CompanyId, payload.CampaignId)
	}
	return nil
}

func (m *MessageConsumerService) consumerFunc(msg *interfaces.MessageTemplateProps[any]) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(time.Second*3))
	defer cancel()
	return m.consumer(ctx, msg)
}

func (m *MessageConsumerService) Start(queueName string) {
	m.rabbitMQService.Consumer(os.Getenv("MESSAGE_QUEUE_NAME"), m.consumerFunc)
}
