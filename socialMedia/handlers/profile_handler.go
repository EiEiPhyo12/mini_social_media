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

// ======================
// GET PROFILE
// ======================

func GetProfile(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)

	var user models.User

	result := config.DB.First(&user, uint(userID))

	if result.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})

		return
	}

	user.Password = ""

	c.JSON(http.StatusOK, user)
}

func UpdateProfile(c *gin.Context) {

	userID := c.MustGet("user_id").(float64)

	var user models.User

	result := config.DB.First(&user, uint(userID))

	if result.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})

		return
	}

	// ======================
	// GET FORM DATA
	// ======================

	username := c.PostForm("username")
	bio := c.PostForm("bio")

	// ======================
	// CHECK USERNAME
	// ======================

	if username != "" && username != user.Username {

		var existingUser models.User

		config.DB.
			Where("username = ?", username).
			First(&existingUser)

		if existingUser.ID != 0 {

			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Username already taken",
			})

			return
		}

		user.Username = username
	}

	user.Bio = bio

	// ======================
	// IMAGE UPLOAD
	// ======================

	file, err := c.FormFile("avatar")

	if err == nil {

		ext := filepath.Ext(file.Filename)

		filename := fmt.Sprintf(
			"user_%d_%d%s",
			user.ID,
			time.Now().Unix(),
			ext,
		)

		savePath := "./uploads/" + filename

		if err := c.SaveUploadedFile(file, savePath); err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to save image",
			})

			return
		}

		user.Avatar =
			"http://localhost:8080/uploads/" +
				filename
	}

	// ======================
	// SAVE
	// ======================

	config.DB.Save(&user)

	user.Password = ""

	c.JSON(http.StatusOK, user)
}

// func GetProfile(c *gin.Context) {

// 	// Get user_id from JWT middleware
// 	userID := c.MustGet("user_id").(float64)

// 	var user models.User

// 	// Find user by ID
// 	result := config.DB.Preload("Post").First(&user, uint(userID))

// 	if result.Error != nil {

// 		c.JSON(http.StatusNotFound, gin.H{
// 			"error": "User not found",
// 			// "userid": userID,
// 			// "error2": result.Error.Error(),
// 		})

// 		return
// 	}

// 	// Hide password
// 	user.Password = ""

// 	c.JSON(http.StatusOK, gin.H{
// 		"user": user,
// 	})
// }

// ======================
// UPDATE PROFILE
// ======================

// func UpdateProfile(c *gin.Context) {

// 	// ======================
// 	// GET USER ID
// 	// ======================

// 	userID := c.MustGet("user_id").(float64)

// 	var user models.User

// 	result := config.DB.First(&user, uint(userID))

// 	if result.Error != nil {

// 		c.JSON(http.StatusNotFound, gin.H{
// 			"error": "User not found",
// 		})

// 		return
// 	}

// 	// ======================
// 	// GET FORM DATA
// 	// ======================

// 	username := c.PostForm("username")
// 	bio := c.PostForm("bio")

// 	// ======================
// 	// UPDATE TEXT FIELDS
// 	// ======================

// 	if username != "" {
// 		user.Username = username
// 	}

// 	user.Bio = bio

// 	// ======================
// 	// HANDLE IMAGE UPLOAD
// 	// ======================

// 	file, err := c.FormFile("avatar")

// 	if err == nil {

// 		// Generate unique filename
// 		ext := filepath.Ext(file.Filename)

// 		filename := fmt.Sprintf(
// 			"user_%d_%d%s",
// 			user.ID,
// 			time.Now().Unix(),
// 			ext,
// 		)

// 		// Save path
// 		savePath := "./uploads/" + filename

// 		// Save file
// 		if err := c.SaveUploadedFile(file, savePath); err != nil {

// 			c.JSON(http.StatusInternalServerError, gin.H{
// 				"error": "Failed to upload image",
// 			})

// 			return
// 		}

// 		// Store image URL in DB
// 		user.Avatar = os.Getenv("BASE_URL") + "/uploads/" + filename
// 	}

// 	// ======================
// 	// SAVE USER
// 	// ======================

// 	config.DB.Save(&user)

// 	user.Password = ""
// 	// c.JSON(http.StatusOK, user)
// 	// }

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Profile updated successfully",
// 		"user":    user,
// 	})
// }
