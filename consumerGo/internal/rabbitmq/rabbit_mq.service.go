package rabbitmq

import (
	"encoding/json"
	"os"

	"github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/interfaces"
	"github.com/streadway/amqp"
)

type RabbiMQService struct {
	connection *amqp.Connection
	channel    *amqp.Channel
}

func (r *RabbiMQService) Connect() {
	url_rabbit := os.Getenv("RABBIT_MQ_URL")
	conn, err := amqp.Dial(url_rabbit)
	if err != nil {
		panic(err)
	}
	r.connection = conn

	channel, err := r.connection.Channel()
	if err != nil {
		panic(err)
	}
	r.channel = channel
}

func (r *RabbiMQService) Consumer(queueName string, consumerFunc func(msg *interfaces.MessageTemplateProps[any]) error) {
	_, err := r.channel.QueueDeclare(queueName, true, false, false, false, nil)
	if err != nil {
		panic(err)
	}
	err = r.channel.Qos(1, 0, false)
	if err != nil {
		panic(err)
	}

	msgs, err := r.channel.Consume(queueName, "", false, false, false, false, nil)
	if err != nil {
		panic(err)
	}

	go func() {
		for d := range msgs {
			var message interfaces.MessageTemplateProps[any]
			json.Unmarshal(d.Body, &message)

			err = consumerFunc(&message)
			if err != nil {
				d.Nack(false, true)
				continue
			}
			d.Ack(false)
		}
	}()
}

func (r *RabbiMQService) Close() {
	if r.channel != nil {
		r.channel.Close()
	}
	if r.connection != nil {
		r.connection.Close()
	}
}
