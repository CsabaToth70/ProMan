--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.cards DROP CONSTRAINT fk_board_id;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.statuses DROP CONSTRAINT statuses_pkey;
ALTER TABLE ONLY public.columns DROP CONSTRAINT columns_pkey;
ALTER TABLE ONLY public.cards DROP CONSTRAINT cards_pkey;
ALTER TABLE ONLY public.boards DROP CONSTRAINT boards_pkey;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.cards ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.boards ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.statuses_id_seq;
DROP TABLE public.statuses;
DROP TABLE public.columns;
DROP SEQUENCE public.cards_order_seq;
DROP SEQUENCE public.cards_id_seq;
DROP TABLE public.cards;
DROP SEQUENCE public.boards_id_seq;
DROP TABLE public.boards;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: boards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.boards (
    id integer NOT NULL,
    title character varying,
    user_email text
);


--
-- Name: boards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.boards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.boards_id_seq OWNED BY public.boards.id;


--
-- Name: cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cards (
    id integer NOT NULL,
    board_id integer,
    title character varying,
    status_id integer,
    "order" integer
);


--
-- Name: cards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cards_id_seq OWNED BY public.cards.id;


--
-- Name: cards_order_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cards_order_seq
    AS integer
    START WITH 2
    INCREMENT BY 1
    MINVALUE 2
    NO MAXVALUE
    CACHE 1;


--
-- Name: columns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.columns (
    column_id integer NOT NULL,
    board_id integer,
    status_id integer,
    is_active boolean DEFAULT true
);


--
-- Name: statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.statuses (
    id integer NOT NULL,
    title character varying
);


--
-- Name: statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.statuses_id_seq
    START WITH 4
    INCREMENT BY 1
    MINVALUE 4
    NO MAXVALUE
    CACHE 1;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text,
    password text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: boards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.boards ALTER COLUMN id SET DEFAULT nextval('public.boards_id_seq'::regclass);


--
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.cards_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: boards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.boards (id, title, user_email) FROM stdin;
4	The best project	lesitocsa@gmail.com
2	Board 2	\N
1	Board 1	\N
\.


--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cards (id, board_id, title, status_id, "order") FROM stdin;
3	1	in progress card	1	0
4	1	planning	2	0
7	2	new card 1	0	0
8	2	new card 2	0	1
13	4	planning	0	5
6	1	done card 1	8	0
21	4	new card 3	3	0
11	2	done card 1	3	0
12	2	done card 1	3	1
10	2	planning	3	2
9	2	in progress card	1	0
22	1	new card 3	15	0
23	1	new card 33	15	1
5	1	done card 1	3	0
\.


--
-- Data for Name: columns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.columns (column_id, board_id, status_id, is_active) FROM stdin;
13	1	3	t
12	1	2	t
11	1	1	t
10	1	0	t
29	2	9	t
23	2	3	t
22	2	2	t
21	2	1	t
20	2	0	t
39	3	9	t
38	3	8	t
33	3	3	t
32	3	2	t
31	3	1	t
30	3	0	t
48	4	8	t
43	4	3	t
42	4	2	t
41	4	1	t
40	4	0	t
210	2	10	t
310	3	10	t
19	1	9	f
112	1	12	f
18	1	8	f
110	1	10	f
111	1	11	f
212	2	12	f
312	3	12	f
411	4	11	f
311	3	11	f
113	1	13	t
412	4	12	f
414	4	14	f
114	1	14	f
413	4	13	f
410	4	10	f
214	2	14	f
313	3	13	t
213	2	13	f
115	1	15	t
315	3	15	t
215	2	15	f
211	2	11	f
28	2	8	f
314	3	14	f
415	4	15	t
49	4	9	f
\.


--
-- Data for Name: statuses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.statuses (id, title) FROM stdin;
0	new
1	in progress
2	testing
3	done
8	on hold
9	rollout
10	retro
11	positivity
12	stopped
13	newstatus
14	added column
15	new
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password) FROM stdin;
1	lesitocsa@gmail.com	pbkdf2:sha256:150000$I9UPPHGl$b790f4e5f35c4e23f7f39f8c2e87d8acaff0930c53b5cab141c58e1cf8a72d4a
\.


--
-- Name: boards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.boards_id_seq', 7, true);


--
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cards_id_seq', 26, true);


--
-- Name: cards_order_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cards_order_seq', 18, true);


--
-- Name: statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.statuses_id_seq', 15, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: boards boards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_pkey PRIMARY KEY (id);


--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- Name: columns columns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_pkey PRIMARY KEY (column_id);


--
-- Name: statuses statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cards fk_board_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES public.boards(id);


--
-- PostgreSQL database dump complete
--

