package model

import "time"

//Sentence Event message
type Sentence struct {
	SentenceID string    `json:"id,omitempty"`
	CreatedAt  time.Time `json:"created_at,omitempty"`
	Content    string    `json:"content,omitempty"`
	Structure  *string   `json:"structure,omitempty"`
	Lang       string    `json:"lang,omitempty"`
}

//Tickets array of Ticket
type Sentences []Sentence
