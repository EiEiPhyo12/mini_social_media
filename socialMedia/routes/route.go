package routes

import (
	"socialmedia/handlers"
	"socialmedia/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {

	router.POST("/register", handlers.Register)
	router.POST("/login", handlers.Login)

	auth := router.Group("/")
	auth.Use(middleware.AuthMiddleware())

	{
		auth.GET("/profile", handlers.GetProfile)
		auth.PUT("/profile", handlers.UpdateProfile)

		auth.GET("/posts", handlers.GetPosts)
		auth.POST("/posts", handlers.CreatePost)
		auth.PUT("/posts/:id", handlers.UpdatePost)
		auth.DELETE("/posts/:id", handlers.DeletePost)
	}
}
