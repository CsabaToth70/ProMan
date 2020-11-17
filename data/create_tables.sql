DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS statuses;
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    title VARCHAR
);
CREATE TABLE cards (
    id INT PRIMARY KEY,
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
INSERT INTO cards VALUES
(1,1,'new card 1',0,0),
(2,1,'new card 2',0,1),
(3,1, 'in progress card',1,0),
(4,1,'planning',2,0),
(5,1,'done card 1',3,0),
(6,1,'done card 1',3,1),
(7,2,'new card 1',0,0),
(8,2,'new card 2',0,1),
(9,2,'in progress card',1,0),
(10,2,'planning',2,0),
(11,2,'done card 1',3,0),
(12,2,'done card 1',3,1);
INSERT INTO boards VALUES (1, 'Board 1'), (2, 'Board 2'), (3, 'Board 3');
ALTER TABLE ONLY cards ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id);