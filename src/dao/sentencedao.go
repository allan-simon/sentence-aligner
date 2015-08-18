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

//GetSentences load all sentences from db
func (d *SentenceDao) GetSentences() *model.Sentences {

	var sentences model.Sentences

	log.Println("Fetching sentences")
	rows, err := DB.Query("SELECT id, added_at, content, iso639_3 FROM sentence")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&id,
			&createdAt,
			&content,
			&lang)

		if err != nil {
			log.Println(err)
		} else {
			sentences = append(sentences,
				model.Sentence{
					SentenceID: id,
					CreatedAt:  createdAt,
					Content:    content,
					Lang:       lang})
		}
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
		return nil
	}
	return &sentences

}

// create a new sentence
func (d *SentenceDao) CreateSentence(sentence *model.Sentence) *model.Sentence {

	_, err := DB.Exec("INSERT INTO sentence (content, iso639_3) VALUES ($1, $2)",
		sentence.Content,
		sentence.Lang)

	if err != nil {
		log.Println(err)
		return nil
	}

	return sentence
}
