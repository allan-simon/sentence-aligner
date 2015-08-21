
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied

ALTER TABLE translation ADD CONSTRAINT constraint_translation_source_dest_id UNIQUE(source_id, dest_id);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

ALTER TABLE translation DROP CONSTRAINT IF EXISTS constraint_translation_source_dest_id;
