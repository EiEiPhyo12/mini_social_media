package main

import (
	"socialmedia/config"
	"socialmedia/models"
	"socialmedia/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDB()

	config.DB.AutoMigrate(
		&models.User{},
		&models.Post{},
	)

	router := gin.Default()

	routes.SetupRoutes(router)

	router.Run(":8080")
}
