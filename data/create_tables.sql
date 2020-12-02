DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS statuses;
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    user_email TEXT
);
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    board_id INT,
    title VARCHAR,
    status_id INT,
    "order" INT
);
CREATE TABLE statuses (
    id INT PRIMARY KEY,
    title VARCHAR
);
INSERT INTO statuses VALUES (0, 'new'), (1, 'in progress'), (2, 'testing'), (3, 'done');
INSERT INTO boards (title) VALUES ('Board 1');
INSERT INTO boards (title) VALUES ('Board 2');
INSERT INTO boards (title) VALUES ('Board 3');
INSERT INTO cards (board_id, title, status_id, "order") VALUES
(1,'new card 1',0,0),
(1,'new card 2',0,1),
(1, 'in progress card',1,0),
(1,'planning',2,0),
(1,'done card 1',3,0),
(1,'done card 1',3,1),
(2,'new card 1',0,0),
(2,'new card 2',0,1),
(2,'in progress card',1,0),
(2,'planning',2,0),
(2,'done card 1',3,0),
(2,'done card 1',3,1);
ALTER TABLE ONLY cards ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

