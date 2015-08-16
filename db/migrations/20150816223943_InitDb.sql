
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied

CREATE TABLE sentence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tatoebaid INT DEFAULT NULL,
    content TEXT NOT NULL,
    iso639_3 TEXT NOT NULL,
    UNIQUE(content, iso639_3)
);
COMMENT ON TABLE sentence IS 'represent a **natural** sentence in a given language';

CREATE TABLE translation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source_id UUID REFERENCES sentence ON DELETE CASCADE,
    dest_id UUID REFERENCES sentence ON DELETE CASCADE,
    alignment_source XML DEFAULT NULL,
    alignment_dest XML DEFAULT NULL
);
COMMENT ON TABLE translation IS 'represent a translation link between two sentences of different languages';


-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

COMMENT ON TABLE sentence is NULL;
COMMENT ON TABLE translation is NULL;
DROP TABLE translation;
DROP TABLE sentence;

