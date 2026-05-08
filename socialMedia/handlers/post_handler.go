package handlers

import (
	"net/http"
	"socialmedia/config"
	"socialmedia/models"

	"github.com/gin-gonic/gin"
)

func CreatePost(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)

	var post models.Post

	c.ShouldBindJSON(&post)

	post.UserID = uint(userID)

	result := config.DB.Create(&post)

	if result.Error != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": result.Error.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, post)
}

func GetPosts(c *gin.Context) {

	var posts []models.Post

	config.DB.Preload("User").Find(&posts)

	c.JSON(http.StatusOK, posts)
}

func UpdatePost(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)
	postID := c.Param("id")

	var post models.Post

	result := config.DB.First(&post, postID)

	if result.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "Post not found",
		})

		return
	}

	if post.UserID != uint(userID) {

		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	c.ShouldBindJSON(&post)

	config.DB.Save(&post)

	c.JSON(http.StatusOK, post)
}

func DeletePost(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)
	postID := c.Param("id")

	var post models.Post

	config.DB.First(&post, postID)

	if post.UserID != uint(userID) {

		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	config.DB.Delete(&post)

	c.JSON(http.StatusOK, gin.H{
		"message": "Post deleted",
	})
}
