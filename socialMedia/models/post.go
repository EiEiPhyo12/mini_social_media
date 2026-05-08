package models

import "gorm.io/gorm"

type Post struct {
	gorm.Model

	Content string `json:"content" gorm:"not null"`

	UserID uint
	User   User
}
