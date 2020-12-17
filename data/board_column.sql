DROP TABLE IF EXISTS public.columns;
CREATE TABLE columns (
    column_id integer PRIMARY KEY,
    board_id integer,
    status_id integer
);