package dao

import (
	"github.com/allan-simon/sentence-aligner/model"
	"log"
	"time"
)

var (
	id        string
	content   string
	lang      string
	createdAt time.Time
)

type SentenceDao struct {
}

//GetSentence load sentence from db
func (d *SentenceDao) GetSentence(id string) *model.Sentence {
	log.Println("Fetching sentence with id:" + id)
	err := DB.QueryRow("SELECT id, added_at, content, iso639_3 FROM sentence WHERE id = $1", id).
		Scan(
		&id,
		&createdAt,
		&content,
		&lang)

	if err != nil {
		log.Println(err)
	} else {
		log.Println(id, createdAt, content, lang)
		sentence := &model.Sentence{
			SentenceID: id,
			CreatedAt:  createdAt,
			Content:    content,
			Lang:       lang}

		return sentence
	}

	return nil
}
