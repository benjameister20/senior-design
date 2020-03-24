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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: datacenters; Type: TABLE; Schema: public; Owner: connorghazaleh
--

CREATE TABLE public.datacenters (
    identifier integer NOT NULL,
    abbreviation character varying(10),
    name character varying(128)
);


ALTER TABLE public.datacenters OWNER TO connorghazaleh;

--
-- Name: datacenters_identifier_seq; Type: SEQUENCE; Schema: public; Owner: connorghazaleh
--

CREATE SEQUENCE public.datacenters_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.datacenters_identifier_seq OWNER TO connorghazaleh;

--
-- Name: datacenters_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: connorghazaleh
--

ALTER SEQUENCE public.datacenters_identifier_seq OWNED BY public.datacenters.identifier;


--
-- Name: decomission; Type: TABLE; Schema: public; Owner: connorghazaleh
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


ALTER TABLE public.decomission OWNER TO connorghazaleh;

--
-- Name: decomission_identifier_seq; Type: SEQUENCE; Schema: public; Owner: connorghazaleh
--

CREATE SEQUENCE public.decomission_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.decomission_identifier_seq OWNER TO connorghazaleh;

--
-- Name: decomission_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: connorghazaleh
--

ALTER SEQUENCE public.decomission_identifier_seq OWNED BY public.decomission.identifier;


--
-- Name: instances; Type: TABLE; Schema: public; Owner: connorghazaleh
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


ALTER TABLE public.instances OWNER TO connorghazaleh;

--
-- Name: instances_identifier_seq; Type: SEQUENCE; Schema: public; Owner: connorghazaleh
--

CREATE SEQUENCE public.instances_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.instances_identifier_seq OWNER TO connorghazaleh;

--
-- Name: instances_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: connorghazaleh
--

ALTER SEQUENCE public.instances_identifier_seq OWNED BY public.instances.identifier;


--
-- Name: models; Type: TABLE; Schema: public; Owner: connorghazaleh
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


ALTER TABLE public.models OWNER TO connorghazaleh;

--
-- Name: models_identifier_seq; Type: SEQUENCE; Schema: public; Owner: connorghazaleh
--

CREATE SEQUENCE public.models_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.models_identifier_seq OWNER TO connorghazaleh;

--
-- Name: models_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: connorghazaleh
--

ALTER SEQUENCE public.models_identifier_seq OWNED BY public.models.identifier;


--
-- Name: racks; Type: TABLE; Schema: public; Owner: connorghazaleh
--

CREATE TABLE public.racks (
    identifier integer NOT NULL,
    label character varying(80),
    datacenter_id integer,
    pdu_left integer[],
    pdu_right integer[]
);


ALTER TABLE public.racks OWNER TO connorghazaleh;

--
-- Name: racks_identifier_seq; Type: SEQUENCE; Schema: public; Owner: connorghazaleh
--

CREATE SEQUENCE public.racks_identifier_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.racks_identifier_seq OWNER TO connorghazaleh;

--
-- Name: racks_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: connorghazaleh
--

ALTER SEQUENCE public.racks_identifier_seq OWNED BY public.racks.identifier;


--
-- Name: users; Type: TABLE; Schema: public; Owner: connorghazaleh
--

CREATE TABLE public.users (
    username character varying(80) NOT NULL,
    password_hash bytea,
    display_name character varying(80),
    email character varying(80),
    privilege json
);


ALTER TABLE public.users OWNER TO connorghazaleh;

--
-- Name: datacenters identifier; Type: DEFAULT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.datacenters ALTER COLUMN identifier SET DEFAULT nextval('public.datacenters_identifier_seq'::regclass);


--
-- Name: decomission identifier; Type: DEFAULT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.decomission ALTER COLUMN identifier SET DEFAULT nextval('public.decomission_identifier_seq'::regclass);


--
-- Name: instances identifier; Type: DEFAULT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.instances ALTER COLUMN identifier SET DEFAULT nextval('public.instances_identifier_seq'::regclass);


--
-- Name: models identifier; Type: DEFAULT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.models ALTER COLUMN identifier SET DEFAULT nextval('public.models_identifier_seq'::regclass);


--
-- Name: racks identifier; Type: DEFAULT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.racks ALTER COLUMN identifier SET DEFAULT nextval('public.racks_identifier_seq'::regclass);


--
-- Data for Name: datacenters; Type: TABLE DATA; Schema: public; Owner: connorghazaleh
--

COPY public.datacenters (identifier, abbreviation, name) FROM stdin;
\.


--
-- Data for Name: decomission; Type: TABLE DATA; Schema: public; Owner: connorghazaleh
--

COPY public.decomission (identifier, vendor, model_number, height, hostname, rack_label, rack_position, owner, comment, datacenter_name, network_connections, power_connections, asset_number, decommission_user, "timestamp", network_neighborhood) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: public; Owner: connorghazaleh
--

COPY public.instances (identifier, model_id, hostname, rack_label, rack_position, owner, comment, datacenter_id, network_connections, power_connections, asset_number) FROM stdin;
\.


--
-- Data for Name: models; Type: TABLE DATA; Schema: public; Owner: connorghazaleh
--

COPY public.models (identifier, vendor, model_number, height, display_color, ethernet_ports, power_ports, cpu, memory, storage, comment) FROM stdin;
1	dell	1234	3	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: racks; Type: TABLE DATA; Schema: public; Owner: connorghazaleh
--

COPY public.racks (identifier, label, datacenter_id, pdu_left, pdu_right) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: connorghazaleh
--

COPY public.users (username, password_hash, display_name, email, privilege) FROM stdin;
admin	\\x24326224313224336b4f70476956392f4450554d6a53536b7035747365366935423831435a33306a71674a622f795936793932576b326c72714f746d	Admin	admin@email.com	{"Model": true, "Asset": true, "Datacenters": ["*"], "Power": true, "Audit": true, "Admin": true}
\.


--
-- Name: datacenters_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: connorghazaleh
--

SELECT pg_catalog.setval('public.datacenters_identifier_seq', 1, false);


--
-- Name: decomission_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: connorghazaleh
--

SELECT pg_catalog.setval('public.decomission_identifier_seq', 1, false);


--
-- Name: instances_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: connorghazaleh
--

SELECT pg_catalog.setval('public.instances_identifier_seq', 1, false);


--
-- Name: models_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: connorghazaleh
--

SELECT pg_catalog.setval('public.models_identifier_seq', 1, true);


--
-- Name: racks_identifier_seq; Type: SEQUENCE SET; Schema: public; Owner: connorghazaleh
--

SELECT pg_catalog.setval('public.racks_identifier_seq', 1, false);


--
-- Name: datacenters datacenters_abbreviation_key; Type: CONSTRAINT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.datacenters
    ADD CONSTRAINT datacenters_abbreviation_key UNIQUE (abbreviation);


--
-- Name: datacenters datacenters_name_key; Type: CONSTRAINT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.datacenters
    ADD CONSTRAINT datacenters_name_key UNIQUE (name);


--
-- Name: datacenters datacenters_pkey; Type: CONSTRAINT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.datacenters
    ADD CONSTRAINT datacenters_pkey PRIMARY KEY (identifier);


--
-- Name: decomission decomission_pkey; Type: CONSTRAINT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.decomission
    ADD CONSTRAINT decomission_pkey PRIMARY KEY (identifier);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (identifier);


--
-- Name: models models_pkey; Type: CONSTRAINT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_pkey PRIMARY KEY (identifier);


--
-- Name: racks racks_pkey; Type: CONSTRAINT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.racks
    ADD CONSTRAINT racks_pkey PRIMARY KEY (identifier);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: connorghazaleh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- PostgreSQL database dump complete
--
