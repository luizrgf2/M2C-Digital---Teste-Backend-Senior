package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Identifier  string             `bson:"identifier,omitempty"`
	PhoneNumber string             `bson:"phone_number,omitempty"`
	Message     string             `bson:"message,omitempty"`
	CampaignID  string             `bson:"campaign_id,omitempty"`
	Deleted     bool               `bson:"deleted"`
	CreatedAt   primitive.DateTime `bson:"created_at,omitempty"`
	UpdatedAt   primitive.DateTime `bson:"updated_at,omitempty"`
}
