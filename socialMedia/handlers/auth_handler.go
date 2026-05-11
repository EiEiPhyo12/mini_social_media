package handlers

import (
	"net/http"
	"socialmedia/config"
	"socialmedia/models"
	"socialmedia/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {

	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input",
		})

		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Hashing failed",
		})
		return
	}

	user.Password = string(hashedPassword)

	result := config.DB.Create(&user)

	if result.Error != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": result.Error.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User Registered",
	})
}
func Login(c *gin.Context) {

	var input models.User
	var user models.User

	c.ShouldBindJSON(&input)

	result := config.DB.Where(
		"email = ?",
		input.Email,
	).First(&user)

	if result.Error != nil {

		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not found",
		})

		return
	}

	err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(input.Password),
	)

	if err != nil {

		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Wrong password",
		})

		return
	}

	token, _ := utils.GenerateJWT(user.ID)

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

func GetUserPosts(c *gin.Context) {

	id := c.Param("id")

	var posts []models.Post

	config.DB.Preload("Likes").Preload("Comments").Preload("Comments.User").Where("user_id = ?", id).
		Order("created_at desc").
		Find(&posts)

	c.JSON(200, posts)
}
