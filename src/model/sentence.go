package model

import "time"

//Sentence Event message
type Sentence struct {
	SentenceID string    `json:"id"`
	CreatedAt  time.Time `json:"created_at"`
	Content    string    `json:"content"`
	Lang       string    `json:"lang"`
}

//Tickets array of Ticket
type Sentences []Sentence
