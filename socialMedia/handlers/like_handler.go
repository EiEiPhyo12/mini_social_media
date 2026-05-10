package handlers

import (
	"errors"
	"net/http"
	"socialmedia/config"
	"socialmedia/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ToggleLike(c *gin.Context) {

	// =========================
	// GET USER ID
	// =========================

	userID := uint(
		c.MustGet("user_id").(float64),
	)

	// =========================
	// GET POST ID
	// =========================

	postIDParam := c.Param("id")

	postID64, err := strconv.ParseUint(
		postIDParam,
		10,
		64,
	)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "Invalid post id",
			},
		)
		return
	}

	postID := uint(postID64)

	// =========================
	// CHECK EXISTING LIKE
	// =========================

	var existingLike models.Like

	err = config.DB.Where(
		"user_id = ? AND post_id = ?",
		userID,
		postID,
	).First(&existingLike).Error

	// =========================
	// UNLIKE
	// =========================

	if err == nil {

		config.DB.Delete(&existingLike)

		c.JSON(
			http.StatusOK,
			gin.H{
				"message": "Post unliked",
				"liked":   false,
			},
		)

		return
	}

	// =========================
	// DATABASE ERROR
	// =========================

	if !errors.Is(err, gorm.ErrRecordNotFound) {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": "Database error",
			},
		)

		return
	}

	// =========================
	// CREATE LIKE
	// =========================

	like := models.Like{
		UserID: userID,
		PostID: postID,
	}

	if err := config.DB.Create(&like).Error; err != nil {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": "Failed to like post",
			},
		)

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"message": "Post liked",
			"liked":   true,
		},
	)
}
