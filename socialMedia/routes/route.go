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
		auth.PATCH("/profile/update", handlers.UpdateProfile)

		auth.GET("/posts", handlers.GetAllPosts)

		auth.POST("/posts/:id/like",
			handlers.ToggleLike)

		auth.POST("/posts/:id/comment",
			handlers.CreateComment)
		auth.GET("/myposts", handlers.GetMyPosts)
		auth.POST("/posts", handlers.CreatePost)
		auth.PATCH("/posts/:id", handlers.UpdatePost)
		auth.DELETE("/posts/:id", handlers.DeletePost)
	}
}
