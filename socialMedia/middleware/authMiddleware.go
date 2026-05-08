package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("secret_key")

func AuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "No token",
			})
			c.Abort()
			return
		}

		// parts := strings.Fields(authHeader)
		// if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		// 	c.JSON(http.StatusUnauthorized, gin.H{
		// 		"error": "Invalid authorization header",
		// 	})
		// 	c.Abort()
		// 	return
		// }

		// tokenString := parts[1]

		tokenString := strings.Split(authHeader, " ")[1]
		token, err := jwt.Parse(tokenString,
			func(token *jwt.Token) (interface{}, error) {
				return jwtKey, nil
			})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token",
			})
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		c.Set("user_id", claims["user_id"])

		c.Next()
	}
}
