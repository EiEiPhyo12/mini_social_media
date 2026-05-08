package handlers

import (
	"net/http"
	"socialmedia/config"
	"socialmedia/models"

	"github.com/gin-gonic/gin"
)

// ======================
// GET PROFILE
// ======================

func GetProfile(c *gin.Context) {

	// Get user_id from JWT middleware
	userID := c.MustGet("user_id").(float64)

	var user models.User

	// Find user by ID
	result := config.DB.First(&user, uint(userID))

	if result.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
			// "userid": userID,
			// "error2": result.Error.Error(),
		})

		return
	}

	// Hide password
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// ======================
// UPDATE PROFILE
// ======================

func UpdateProfile(c *gin.Context) {

	// Get logged in user ID
	userID := c.MustGet("user_id").(float64)

	var user models.User

	// Find existing user
	result := config.DB.First(&user, uint(userID))

	if result.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})

		return
	}

	// Input structure
	var input struct {
		Username string `json:"username"`
		Bio      string `json:"bio"`
		Avatar   string `json:"avatar"`
	}

	// Bind JSON request
	if err := c.ShouldBindJSON(&input); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input",
		})

		return
	}

	// Update fields
	user.Username = input.Username
	user.Bio = input.Bio
	user.Avatar = input.Avatar

	// Save changes
	config.DB.Save(&user)

	// Hide password
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile updated successfully",
		"user":    user,
	})
}
