package rds

import (
	"context"
	"fmt"
	"os"
	"sync"

	"github.com/redis/go-redis/v9"
)

var (
	once     sync.Once
	instance *redis.Client
)

func GetRedisInstance() *redis.Client {
	once.Do(func() {

		rdb, err := redis.ParseURL(os.Getenv("REDIS_URL"))
		if err != nil {
			panic(err)
		}

		instance = redis.NewClient(&redis.Options{
			Addr:     rdb.Addr,
			Password: rdb.Password,
			DB:       0,
		})

		ctx := context.Background()
		_, err = instance.Ping(ctx).Result()
		if err != nil {
			panic(fmt.Sprintf("error to redis connect: %v", err))
		}
	})

	return instance
}
