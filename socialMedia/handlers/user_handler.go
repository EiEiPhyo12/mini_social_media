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

func Search(c *gin.Context) {

	query := c.Query("q")

	if query == "" {
		c.JSON(200, gin.H{
			"users": []any{},
			"posts": []any{},
		})
		return
	}

	// =====================
	// SEARCH USERS
	// =====================
	var users []models.User

	config.DB.Where(
		"username LIKE ? OR email LIKE ?",
		"%"+query+"%",
		"%"+query+"%",
	).
		Limit(10).
		Find(&users)

	// =====================
	// SEARCH POSTS
	// =====================
	var posts []models.Post

	config.DB.
		Preload("User").
		Where("content LIKE ?", "%"+query+"%").
		Limit(10).
		Find(&posts)

	// =====================
	// RESPONSE
	// =====================
	c.JSON(200, gin.H{
		"users": users,
		"posts": posts,
	})
}

func GetUser(c *gin.Context) {

	id := c.Param("id")

	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	c.JSON(200, user)
}

func GetPost(c *gin.Context) {

	id := c.Param("id")

	var post models.Post

	if err := config.DB.
		Preload("User").
		Preload("Likes").
		Preload("Comments").
		Preload("Comments.User").
		First(&post, id).Error; err != nil {

		c.JSON(404, gin.H{"error": "Post not found"})
		return
	}

	c.JSON(200, post)
}
