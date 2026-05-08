package models

import "gorm.io/gorm"

type User struct {
	gorm.Model

	Username string `json:"username" gorm:"unique;not null"`
	Email    string `json:"email" gorm:"unique;not null"`
	Password string `json:"-" gorm:"not null"` // IMPORTANT FIX

	Bio    string `json:"bio"`
	Avatar string `json:"avatar"`

	Posts []Post `json:"-" gorm:"foreignKey:UserID"`
}
