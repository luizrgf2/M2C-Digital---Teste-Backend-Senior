package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	"github.com/luizrgf2/M2C-Digital---Teste-Backend-Senior/internal/rabbitmq"
)

func main() {

	godotenv.Load(".env")

	sigchan := make(chan os.Signal, 1)
	signal.Notify(sigchan, syscall.SIGINT, syscall.SIGTERM)

	forever := make(chan bool)

	rabbit := rabbitmq.NewMessageConsumerServiceFactory()
	rabbit.Start(os.Getenv("MESSAGE_QUEUE_NAME"))

	log.Printf("interrupted, shutting down")
	forever <- true

}
