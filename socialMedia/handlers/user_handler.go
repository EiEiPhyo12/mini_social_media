package handlers

import (
	"net/http"
	"socialmedia/config"
	"socialmedia/models"

	"github.com/gin-gonic/gin"
)

func GetSuggestedUsers(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)

	var users []models.User

	config.DB.
		Where("id != ?", uint(userID)).
		Limit(5).
		Find(&users)

	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, users)
}
