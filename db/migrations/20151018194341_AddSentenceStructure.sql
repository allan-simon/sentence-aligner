
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied

ALTER TABLE sentence ADD COLUMN structure XML;

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

ALTER TABLE sentence DROP COLUMN structure;

