package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"socialmedia/config"
	"socialmedia/models"
	"time"

	"github.com/gin-gonic/gin"
)

func GetMyPosts(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)

	var posts []models.Post

	result := config.DB.
		Where("user_id = ?", uint(userID)).
		Order("created_at desc").
		Find(&posts)

	if result.Error != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch posts",
		})

		return
	}

	c.JSON(http.StatusOK, posts)
}

// ======================
// CREATE POST
// ======================

func CreatePost(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)

	content := c.PostForm("content")

	var imageURL string

	// ======================
	// IMAGE UPLOAD
	// ======================

	file, err := c.FormFile("image")

	if err == nil {

		ext := filepath.Ext(file.Filename)

		filename := fmt.Sprintf(
			"post_%d_%d%s",
			uint(userID),
			time.Now().Unix(),
			ext,
		)

		savePath := "./uploads/" + filename

		if err := c.SaveUploadedFile(file, savePath); err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to upload image",
			})

			return
		}

		imageURL =
			"http://localhost:8080/uploads/" +
				filename
	}

	post := models.Post{
		Content: content,
		Image:   imageURL,
		UserID:  uint(userID),
	}

	config.DB.Create(&post)
	config.DB.Preload("User").First(&post, post.ID)

	c.JSON(http.StatusOK, post)
}

func GetAllPosts(c *gin.Context) {

	var posts []models.Post

	err := config.DB.
		Preload("User").
		Preload("Likes").
		Preload("Comments").
		Preload("Comments.User").
		Order("created_at desc").
		Find(&posts).Error

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch posts",
		})

		return
	}

	c.JSON(http.StatusOK, posts)
}

// ======================
// UPDATE POST
// ======================

func UpdatePost(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)

	postID := c.Param("id")

	var post models.Post

	// ======================
	// FIND POST
	// ======================

	result := config.DB.First(
		&post,
		postID,
	)

	if result.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "Post not found",
		})

		return
	}

	// ======================
	// SECURITY CHECK
	// ======================

	if post.UserID != uint(userID) {

		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	// ======================
	// UPDATE CONTENT
	// ======================

	content := c.PostForm("content")

	post.Content = content

	// ======================
	// REMOVE IMAGE
	// ======================

	removeImage := c.PostForm(
		"remove_image",
	)

	if removeImage == "true" {

		post.Image = ""
	}

	// ======================
	// HANDLE NEW IMAGE
	// ======================

	file, err := c.FormFile("image")

	if err == nil {

		ext := filepath.Ext(
			file.Filename,
		)

		filename := fmt.Sprintf(
			"post_%d_%d%s",
			post.ID,
			time.Now().Unix(),
			ext,
		)

		savePath :=
			"./uploads/" + filename

		if err := c.SaveUploadedFile(
			file,
			savePath,
		); err != nil {

			c.JSON(
				http.StatusInternalServerError,
				gin.H{
					"error": "Failed to save image",
				},
			)

			return
		}

		post.Image =
			"http://localhost:8080/uploads/" +
				filename
	}

	// ======================
	// SAVE
	// ======================

	config.DB.Save(&post)

	c.JSON(http.StatusOK, post)
}

// ======================
// DELETE POST
// ======================
func DeletePost(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)

	postID := c.Param("id")

	var post models.Post

	// Find ONLY user's own post
	result := config.DB.
		Where(
			"id = ? AND user_id = ?",
			postID,
			uint(userID),
		).
		First(&post)

	if result.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "Post not found",
		})

		return
	}

	// Delete
	config.DB.Delete(&post)

	c.JSON(http.StatusOK, gin.H{
		"message": "Post deleted successfully",
	})
}

// func DeletePost(c *gin.Context) {

// 	userID := c.MustGet("user_id").(float64)

// 	postID := c.Param("id")

// 	var post models.Post

// 	result := config.DB.First(&post, postID)

// 	if result.Error != nil {

// 		c.JSON(http.StatusNotFound, gin.H{
// 			"error": "Post not found",
// 		})

// 		return
// 	}

// 	// Ownership check
// 	if post.UserID != uint(userID) {

// 		c.JSON(http.StatusForbidden, gin.H{
// 			"error": "Unauthorized",
// 		})

// 		return
// 	}

// 	config.DB.Delete(&post)

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Post deleted",
// 	})
// }
