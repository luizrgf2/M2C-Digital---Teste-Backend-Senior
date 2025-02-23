package repository

import (
	"context"
	"time"

	"github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/mongo/models"
	"github.com/segmentio/ksuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MessageRepository struct {
	collection *mongo.Collection
}

func NewMessageRepository(client *mongo.Client) *MessageRepository {
	return &MessageRepository{
		collection: client.Database("mydb").Collection("messages"),
	}
}

func (r *MessageRepository) Create(message *models.Message) (string, error) {
	message.Identifier = ksuid.New().String()
	message.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	message.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())

	_, err := r.collection.InsertOne(context.Background(), message)
	return message.Identifier, err
}
