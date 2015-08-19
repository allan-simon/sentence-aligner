package model

import "time"

//Translation Event message
type Translation struct {
	TranslationID   string    `json:"id,omitempty"`
	CreatedAt       time.Time `json:"created_at,omitempty"`
	SourceID        string    `json:"source_id"`
	DestID          string    `json:"dest_id"`
	AlignmentDest   *string   `json:"alignment_dest,omitempty"`
	AlignmentSource *string   `json:"alignment_source,omitempty"`
}

//Translations array of Translation
type Translations []Translation
