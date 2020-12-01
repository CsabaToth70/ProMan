DROP TABLE IF EXISTS public.users;
CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    email text,
    password text
);