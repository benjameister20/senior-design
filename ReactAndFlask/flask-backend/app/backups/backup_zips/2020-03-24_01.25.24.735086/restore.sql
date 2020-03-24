--
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

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

DROP DATABASE test;
--
-- Name: test; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE test WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';


\connect test

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: datacenters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.datacenters (
    identifier integer NOT NULL,
    abbreviation character varying(10),
    name character varying(128)
);


--
-- Name: datacenters_identifier_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.datacenters_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: datacenters_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.datacenters_identifier_seq OWNED BY public.datacenters.identifier;


--
-- Name: decomission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.decomission (
    identifier integer NOT NULL,
    vendor character varying(80),
    model_number character varying(80),
    height integer,
    hostname character varying(80),
    rack_label character varying(80),
    rack_position integer,
    owner character varying(80),
    comment character varying(80),
    datacenter_name character varying(80),
    network_connections json,
    power_connections character varying(50)[],
    asset_number integer,
    decommission_user character varying(80),
    "timestamp" date,
    network_neighborhood json
);


--
-- Name: decomission_identifier_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.decomission_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: decomission_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.decomission_identifier_seq OWNED BY public.decomission.identifier;


--
-- Name: instances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.instances (
    identifier integer NOT NULL,
    model_id integer,
    hostname character varying(80),
    rack_label character varying(80),
    rack_position integer,
    owner character varying(80),
    comment character varying(80),
    datacenter_id integer,
    network_connections json,
    power_connections character varying(50)[],
    asset_number integer
);


--
-- Name: instances_identifier_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.instances_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: instances_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.instances_identifier_seq OWNED BY public.instances.identifier;


--
-- Name: models; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.models (
    identifier integer NOT NULL,
    vendor character varying(80),
    model_number character varying(80),
    height integer,
    display_color character varying(80),
    ethernet_ports character varying(80)[],
    power_ports integer,
    cpu character varying(80),
    memory integer,
    storage character varying(80),
    comment character varying(80)
);


--
-- Name: models_identifier_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.models_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: models_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.models_identifier_seq OWNED BY public.models.identifier;


--
-- Name: racks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.racks (
    identifier integer NOT NULL,
    label character varying(80),
    datacenter_id integer,
    pdu_left integer[],
    pdu_right integer[]
);


--
-- Name: racks_identifier_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.racks_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: racks_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.racks_identifier_seq OWNED BY public.racks.identifier;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    username character varying(80) NOT NULL,
    password_hash bytea,
    display_name character varying(80),
    email character varying(80),
    privilege json
);


--
-- Name: datacenters identifier; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.datacenters ALTER COLUMN identifier SET DEFAULT nextval('public.datacenters_identifier_seq'::regclass);


--
-- Name: decomission identifier; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decomission ALTER COLUMN identifier SET DEFAULT nextval('public.decomission_identifier_seq'::regclass);


--
-- Name: instances identifier; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instances ALTER COLUMN identifier SET DEFAULT nextval('public.instances_identifier_seq'::regclass);


--
-- Name: models identifier; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.models ALTER COLUMN identifier SET DEFAULT nextval('public.models_identifier_seq'::regclass);


--
-- Name: racks identifier; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.racks ALTER COLUMN identifier SET DEFAULT nextval('public.racks_identifier_seq'::regclass);


--
-- Data for Name: datacenters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.datacenters (identifier, abbreviation, name) FROM stdin;
\.
COPY public.datacenters (identifier, abbreviation, name) FROM '$$PATH$$/3237.dat';

--
-- Data for Name: decomission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.decomission (identifier, vendor, model_number, height, hostname, rack_label, rack_position, owner, comment, datacenter_name, network_connections, power_connections, asset_number, decommission_user, "timestamp", network_neighborhood) FROM stdin;
\.
COPY public.decomission (identifier, vendor, model_number, height, hostname, rack_label, rack_position, owner, comment, datacenter_name, network_connections, power_connections, asset_number, decommission_user, "timestamp", network_neighborhood) FROM '$$PATH$$/3239.dat';

--
-- Data for Name: instances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.instances (identifier, model_id, hostname, rack_label, rack_position, owner, comment, datacenter_id, network_connections, power_connections, asset_number) FROM stdin;
\.
COPY public.instances (identifier, model_id, hostname, rack_label, rack_position, owner, comment, datacenter_id, network_connections, power_connections, asset_number) FROM '$$PATH$$/3241.dat';

--
-- Data for Name: models; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.models (identifier, vendor, model_number, height, display_color, ethernet_ports, power_ports, cpu, memory, storage, comment) FROM stdin;
\.
COPY public.models (identifier, vendor, model_number, height, display_color, ethernet_ports, power_ports, cpu, memory, storage, comment) FROM '$$PATH$$/3243.dat';

--
-- Data for Name: racks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.racks (identifier, label, datacenter_id, pdu_left, pdu_right) FROM stdin;
\.
COPY public.racks (identifier, label, datacenter_id, pdu_left, pdu_right) FROM '$$PATH$$/3245.dat';

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (username, password_hash, display_name, email, privilege) FROM stdin;
\.
COPY public.users (username, password_hash, display_name, email, privilege) FROM '$$PATH$$/3247.dat';

--
-- Name: datacenters_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.datacenters_identifier_seq', 1, false);


--
-- Name: decomission_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.decomission_identifier_seq', 1, false);


--
-- Name: instances_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.instances_identifier_seq', 1, false);


--
-- Name: models_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.models_identifier_seq', 1, true);


--
-- Name: racks_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.racks_identifier_seq', 1, false);


--
-- Name: datacenters datacenters_abbreviation_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.datacenters
    ADD CONSTRAINT datacenters_abbreviation_key UNIQUE (abbreviation);


--
-- Name: datacenters datacenters_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.datacenters
    ADD CONSTRAINT datacenters_name_key UNIQUE (name);


--
-- Name: datacenters datacenters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.datacenters
    ADD CONSTRAINT datacenters_pkey PRIMARY KEY (identifier);


--
-- Name: decomission decomission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decomission
    ADD CONSTRAINT decomission_pkey PRIMARY KEY (identifier);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (identifier);


--
-- Name: models models_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_pkey PRIMARY KEY (identifier);


--
-- Name: racks racks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.racks
    ADD CONSTRAINT racks_pkey PRIMARY KEY (identifier);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- PostgreSQL database dump complete
--
