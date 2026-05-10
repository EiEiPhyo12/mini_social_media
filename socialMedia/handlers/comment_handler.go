package handlers

import (
	"net/http"
	"socialmedia/config"
	"socialmedia/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CreateCommentInput struct {
	Content string `json:"content"`
}

func CreateComment(c *gin.Context) {

	userID := uint(c.MustGet("user_id").(float64))

	postIDParam := c.Param("id")

	postID64, err := strconv.ParseUint(postIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post id"})
		return
	}

	postID := uint(postID64)

	var body CreateCommentInput

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if body.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment cannot be empty"})
		return
	}

	// =========================
	// CREATE COMMENT
	// =========================

	comment := models.Comment{
		Content: body.Content,
		UserID:  userID,
		PostID:  postID,
	}

	if err := config.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	// =========================
	// RELOAD WITH USER (IMPORTANT FIX)
	// =========================

	if err := config.DB.
		Preload("User").
		First(&comment, comment.ID).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to load comment",
		})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

func DeleteComment(c *gin.Context) {

	userID := uint(
		c.MustGet("user_id").(float64),
	)

	commentIDParam := c.Param("id")

	commentID64, err := strconv.ParseUint(
		commentIDParam,
		10,
		64,
	)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "Invalid comment id",
			},
		)

		return
	}

	commentID := uint(commentID64)

	var comment models.Comment

	if err := config.DB.First(
		&comment,
		commentID,
	).Error; err != nil {

		c.JSON(
			http.StatusNotFound,
			gin.H{
				"error": "Comment not found",
			},
		)

		return
	}

	// OWNER CHECK

	if comment.UserID != userID {

		c.JSON(
			http.StatusForbidden,
			gin.H{
				"error": "Unauthorized",
			},
		)

		return
	}

	config.DB.Delete(&comment)

	c.JSON(
		http.StatusOK,
		gin.H{
			"message": "Comment deleted",
		},
	)
}
