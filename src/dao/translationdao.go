package dao

import (
	"github.com/allan-simon/sentence-aligner/model"
	"log"
)

var (
	sourceId        string
	destId          string
	alignmentSource *string
	alignmentDest   *string
)

type TranslationDao struct {
}

//GetTranslation load translation from db
func (d *TranslationDao) GetTranslation(id string) *model.Translation {
	log.Println("Fetching translation with id:" + id)
	err := DB.QueryRow("SELECT * FROM translation WHERE id = $1", id).
		Scan(
		&id,
		&sourceId,
		&destId,
		&alignmentSource,
		&alignmentDest)

	if err != nil {
		log.Println(err)
		return nil
	}
	translation := &model.Translation{
		TranslationID:   id,
		CreatedAt:       createdAt,
		SourceID:        sourceId,
		DestID:          destId,
		AlignmentSource: alignmentSource,
		AlignmentDest:   alignmentDest}

	return translation
}

//GetTranslations load all translations from db
func (d *TranslationDao) GetTranslations() *model.Translations {

	var translations model.Translations

	log.Println("Fetching translations")
	rows, err := DB.Query("SELECT id, added_at, source_id, dest_id, alignment_source, alignment_dest FROM translation")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&id,
			&createdAt,
			&sourceId,
			&destId,
			&alignmentSource,
			&alignmentDest)

		if err != nil {
			log.Println(err)
		} else {
			translations = append(translations,
				model.Translation{
					TranslationID:   id,
					CreatedAt:       createdAt,
					SourceID:        sourceId,
					DestID:          destId,
					AlignmentDest:   alignmentDest,
					AlignmentSource: alignmentSource})
		}
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
		return nil
	}
	return &translations

}

// create a new translation
func (d *TranslationDao) CreateTranslation(translation *model.Translation) *model.Translation {

	_, err := DB.Exec("INSERT INTO translation (source_id, dest_id) VALUES ($1, $2)",
		translation.SourceID,
		translation.DestID)

	// TODO: find a way to know when the error is because we're adding an existing translation
	if err != nil {
		log.Println(err)
		return nil
	}
	// TODO: get the actual saved translation (with id and created_at)
	return translation
}

// add alignments data to an existing translation
func (d *TranslationDao) AddAlignments(id string, translation *model.Translation) (*model.Translation, error) {
	result, err := DB.Exec("UPDATE translation SET alignment_source = $1, alignment_dest = $2 WHERE id =  $3",
		translation.AlignmentSource,
		translation.AlignmentDest,
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
	translation.TranslationID = id

	return translation, nil
}
