package models

import "gorm.io/gorm"

type Post struct {
	gorm.Model

	Content string `json:"content"`
	Image   string `json:"image"`

	UserID uint `json:"user_id"`

	User          User      `json:"user"`
	Likes         []Like    `json:"likes"`
	Comments      []Comment `json:"comments"`
	CommentsCount int64     `json:"comments_count" gorm:"-"`
}
