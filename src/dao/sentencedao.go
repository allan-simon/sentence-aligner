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
	err := DB.QueryRow(
		`SELECT id, added_at, content, iso639_3 FROM sentence WHERE id = $1`,
		id,
	).Scan(
		&id,
		&createdAt,
		&content,
		&lang,
	)

	if err != nil {
		log.Println(err)
		return nil
	}

	log.Println(id, createdAt, content, lang)
	sentence := &model.Sentence{
		SentenceID: id,
		CreatedAt:  createdAt,
		Content:    content,
		Lang:       lang,
	}

	return sentence
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
			&lang,
		)

		if err != nil {
			log.Println(err)
			continue
		}
		sentences = append(
			sentences,
			model.Sentence{
				SentenceID: id,
				CreatedAt:  createdAt,
				Content:    content,
				Lang:       lang,
			},
		)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
		return nil
	}

	return &sentences

}

//Load translation sentences
func (d *SentenceDao) GetTranslationSentences(sourceId string) *model.Sentences {

	sentences := model.Sentences{}

	log.Println("Fetching sentence's translations")
	rows, err := DB.Query(
		`
			SELECT
				s.id,
				s.added_at,
				s.content,
				s.iso639_3
			FROM sentence s
			JOIN translation t ON (t.dest_id = s.id)
			WHERE t.source_id = $1
		`,
		&sourceId,
	)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&id,
			&createdAt,
			&content,
			&lang,
		)

		if err != nil {
			log.Println(err)
			continue
		}
		sentences = append(
			sentences,
			model.Sentence{
				SentenceID: id,
				CreatedAt:  createdAt,
				Content:    content,
				Lang:       lang,
			},
		)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
		return nil
	}

	return &sentences

}

//
func (d *SentenceDao) GetSentenceByContentLang(
	sentence *model.Sentence,
) *model.Sentence {

	err := DB.QueryRow(
		`
			SELECT id, added_at, content, iso639_3
			FROM sentence
			WHERE content = $1 AND iso639_3 = $2
		`,
		sentence.Content,
		sentence.Lang,
	).Scan(
		&id,
		&createdAt,
		&content,
		&lang,
	)

	if err != nil {
		log.Println(err)
		return nil
	}

	existingSentence := &model.Sentence{
		SentenceID: id,
		CreatedAt:  createdAt,
		Content:    content,
		Lang:       lang,
	}

	return existingSentence
}

// create a new sentence
func (d *SentenceDao) CreateSentence(sentence *model.Sentence) *model.Sentence {

	err := DB.QueryRow(
		`
			INSERT INTO sentence (content, iso639_3)
			VALUES ($1, $2)
			RETURNING id, added_at
		`,
		sentence.Content,
		sentence.Lang,
	).Scan(
		&sentence.SentenceID,
		&sentence.CreatedAt,
	)

	// TODO: find a way to know when the error is because
	// we're adding an existing sentence
	if err != nil {
		log.Println(err)
		return nil
	}
	return sentence
}

func (d *SentenceDao) UpdateSentence(
	id string,
	sentence *model.Sentence,
) (*model.Sentence, error) {

	result, err := DB.Exec(
		"UPDATE sentence SET content = $1, iso639_3 = $2 WHERE id =  $3",
		sentence.Content,
		sentence.Lang,
		id,
	)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	rowsAffected, err := result.RowsAffected()
	if rowsAffected < 0 {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}
	sentence.SentenceID = id

	return sentence, nil
}
