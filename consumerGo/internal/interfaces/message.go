package interfaces

import "time"

type MessageTemplateProps[T any] struct {
	Id      string    `json:"id"`
	Type    string    `json:"type"`
	Date    time.Time `json:"date"`
	Payload T         `json:"payload"`
}

type MessageInfoQuantityProps struct {
	UserId     string `json:"userId"`
	CompanyId  string `json:"companyId"`
	CampaignId string `json:"campaignId"`
	Quantity   int    `json:"quantity"`
}

type IMessage struct {
	UserId      string `json:"userId"`
	CompanyId   string `json:"companyId"`
	CampaignId  string `json:"campaignId"`
	PhoneNumber string `json:"phoneNumber"`
	Message     string `json:"message"`
}
