CREATE TABLE folders (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    date_published TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    modified TEXT,
    folder_id INTEGER,
    content TEXT NOT NULL,
    date_published TIMESTAMPTZ DEFAULT now() NOT NULL
);