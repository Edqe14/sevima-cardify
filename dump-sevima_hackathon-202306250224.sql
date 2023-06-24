--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6
-- Dumped by pg_dump version 14.6

-- Started on 2023-06-25 02:24:47 +07

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

--
-- TOC entry 3 (class 2615 OID 19177)
-- Name: public; Type: SCHEMA; Schema: -; Owner: edqe
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO edqe;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 19178)
-- Name: Account; Type: TABLE; Schema: public; Owner: edqe
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    "refreshToken" text,
    "accessToken" text,
    "expiresAt" integer,
    "tokenType" text,
    scope text,
    "idToken" text,
    "sessionState" text
);


ALTER TABLE public."Account" OWNER TO edqe;

--
-- TOC entry 213 (class 1259 OID 19204)
-- Name: Collection; Type: TABLE; Schema: public; Owner: edqe
--

CREATE TABLE public."Collection" (
    id text NOT NULL,
    name text NOT NULL,
    document jsonb,
    public boolean DEFAULT false NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "accessList" jsonb[] DEFAULT ARRAY[]::jsonb[]
);


ALTER TABLE public."Collection" OWNER TO edqe;

--
-- TOC entry 214 (class 1259 OID 19213)
-- Name: Item; Type: TABLE; Schema: public; Owner: edqe
--

CREATE TABLE public."Item" (
    id text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "collectionId" text NOT NULL,
    "order" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Item" OWNER TO edqe;

--
-- TOC entry 210 (class 1259 OID 19185)
-- Name: Session; Type: TABLE; Schema: public; Owner: edqe
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO edqe;

--
-- TOC entry 211 (class 1259 OID 19192)
-- Name: User; Type: TABLE; Schema: public; Owner: edqe
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text
);


ALTER TABLE public."User" OWNER TO edqe;

--
-- TOC entry 212 (class 1259 OID 19199)
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: edqe
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO edqe;

--
-- TOC entry 3363 (class 0 OID 19178)
-- Dependencies: 209
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", "refreshToken", "accessToken", "expiresAt", "tokenType", scope, "idToken", "sessionState") FROM stdin;
clj9qzrr6000zcnnwot1jvm1w	clj9qzrqv000wcnnw2ooobgx9	oauth	google	102500504533523610958	\N	ya29.a0AWY7CkkdRvpcH_mGyS4nxCG8h-mqIpN9QnJVgLZc-2OlFRTrLPQ0Nb-dezbHTfhvWH87M38QT5vJQUs2bNC4Fy4CiQ2zfvoBDwpgPPY5OA1aJB54ZZX8E3O5An2IG4dGCxFdBv7p4SHIYKCEj2lbJWmo7yjmaCgYKAUcSARISFQG1tDrpcAw57QUa73qiu8p9iVRxbA0163	1687599443	Bearer	openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email	eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk5YmNiMDY5MzQwYTNmMTQ3NDYyNzk0ZGZlZmE3NWU3OTk2MTM2MzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2NTkzNDU3NjYwMjEtN3NxbWhlYmNkNjVpOXJnc3AwbGN0Z2ZjcWZoOGFxN2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2NTkzNDU3NjYwMjEtN3NxbWhlYmNkNjVpOXJnc3AwbGN0Z2ZjcWZoOGFxN2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI1MDA1MDQ1MzM1MjM2MTA5NTgiLCJlbWFpbCI6ImNvbmZpZ3hndEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkxEd0RyNERiTndNNlVpdlNkOGxBdmciLCJuYW1lIjoiRWRxZV8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0YzctdEljQTh0aFBrZWU4N1JCQUtIMUZhNmJJLWp0VHBxc3pseUpsdz1zOTYtYyIsImdpdmVuX25hbWUiOiJFZHFlXyIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjg3NTk1ODQ0LCJleHAiOjE2ODc1OTk0NDR9.gJpiDI9-Jg8vc5MJNjoN295XZWqD6MXVD0DJfYzZIx8xkr3_FSAjMM26wB-J7OHWba9s_tIzTnRJ5iufR7IN4E-N-zlZIEEnEKm9DB605Xzb9YS4quTmgt-jhvUFGYFReQ3o9TSyhlj3m74QEneqiFqLdEzx0lp6sIdw_IZq-pW2vtnmLZ6FlWseZ8mh58FC-eVBtEV_uQRM0nJSYfIcqX-3LvVcgQJCRLFnukBXyE1rLZpw_r_YZ_NlEg5FKdA2befZyFMmFj8RR89hXO09QaniHKGrP4EIPe01U0iHAyYb1lCOQJDQUaTdO3YwwsMHhPUYnDL2ceD8MoI7xKZdCQ	\N
\.


--
-- TOC entry 3367 (class 0 OID 19204)
-- Dependencies: 213
-- Data for Name: Collection; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."Collection" (id, name, document, public, "userId", "createdAt", "updatedAt", "accessList") FROM stdin;
cljad9mcr0001cnmymgwlcogd	math	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": "left"}, "content": [{"text": "Mathematics", "type": "text", "marks": [{"type": "bold"}]}, {"text": " is an area of ", "type": "text"}, {"text": "knowledge", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Knowledge", "class": null, "target": "_blank"}}]}, {"text": " that includes the topics of numbers, formulas and related structures, shapes and the spaces in which they are contained, and quantities and their changes. These topics are represented in modern mathematics with the major subdisciplines of ", "type": "text"}, {"text": "number theory", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Number_theory", "class": null, "target": "_blank"}}]}, {"text": ",", "type": "text"}, {"text": "[1]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-OED-1", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": " ", "type": "text"}, {"text": "algebra", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Algebra", "class": null, "target": "_blank"}}]}, {"text": ",", "type": "text"}, {"text": "[2]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-Kneebone-2", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": " ", "type": "text"}, {"text": "geometry", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Geometry", "class": null, "target": "_blank"}}]}, {"text": ",", "type": "text"}, {"text": "[1]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-OED-1", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": " and ", "type": "text"}, {"text": "analysis", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematical_analysis", "class": null, "target": "_blank"}}]}, {"text": ",", "type": "text"}, {"text": "[3]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-LaTorre-3", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": "[4]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-Ramana-4", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": " respectively. There is no general consensus among mathematicians about a common definition for their ", "type": "text"}, {"text": "academic discipline", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Academic_discipline", "class": null, "target": "_blank"}}]}, {"text": ".", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": "start"}, "content": [{"text": "Most mathematical activity involves the discovery of properties of ", "type": "text"}, {"text": "abstract objects", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematical_object", "class": null, "target": "_blank"}}]}, {"text": " and the use of pure ", "type": "text"}, {"text": "reason", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Reason", "class": null, "target": "_blank"}}]}, {"text": " to ", "type": "text"}, {"text": "prove", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Proof_(mathematics)", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " them. These objects consist of either ", "type": "text"}, {"text": "abstractions", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Abstraction_(mathematics)", "class": null, "target": "_blank"}}]}, {"text": " from nature or—in modern mathematics—entities that are stipulated to have certain properties, called ", "type": "text"}, {"text": "axioms", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Axiom", "class": null, "target": "_blank"}}]}, {"text": ". A ", "type": "text"}, {"text": "proof", "type": "text", "marks": [{"type": "italic"}]}, {"text": " consists of a succession of applications of ", "type": "text"}, {"text": "deductive rules", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Inference_rule", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " to already established results. These results include previously proved ", "type": "text"}, {"text": "theorems", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Theorem", "class": null, "target": "_blank"}}]}, {"text": ", axioms, and—in case of abstraction from nature—some basic properties that are considered true starting points of the theory under consideration.", "type": "text"}, {"text": "[5]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-5", "class": null, "target": "_blank"}}, {"type": "superscript"}]}]}, {"type": "paragraph", "attrs": {"textAlign": "start"}, "content": [{"text": "Mathematics is essential in the ", "type": "text"}, {"text": "natural sciences", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Natural_science", "class": null, "target": "_blank"}}]}, {"text": ", ", "type": "text"}, {"text": "engineering", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Engineering", "class": null, "target": "_blank"}}]}, {"text": ", ", "type": "text"}, {"text": "medicine", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Medicine", "class": null, "target": "_blank"}}]}, {"text": ", ", "type": "text"}, {"text": "finance", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Finance", "class": null, "target": "_blank"}}]}, {"text": ", ", "type": "text"}, {"text": "computer science", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Computer_science", "class": null, "target": "_blank"}}]}, {"text": " and the ", "type": "text"}, {"text": "social sciences", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Social_sciences", "class": "mw-redirect", "target": "_blank"}}]}, {"text": ". Although mathematics is extensively used for modeling phenomena, the fundamental truths of mathematics are independent from any scientific experimentation. Some areas of mathematics, such as ", "type": "text"}, {"text": "statistics", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Statistics", "class": null, "target": "_blank"}}]}, {"text": " and ", "type": "text"}, {"text": "game theory", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Game_theory", "class": null, "target": "_blank"}}]}, {"text": ", are developed in close correlation with their applications and are often grouped under ", "type": "text"}, {"text": "applied mathematics", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Applied_mathematics", "class": null, "target": "_blank"}}]}, {"text": ". Other areas are developed independently from any application (and are therefore called ", "type": "text"}, {"text": "pure mathematics", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Pure_mathematics", "class": null, "target": "_blank"}}]}, {"text": "), but often later find practical applications.", "type": "text"}, {"text": "[6]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-FOOTNOTEPeterson200112-6", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": "[7]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-wigner1960-7", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": " The problem of ", "type": "text"}, {"text": "integer factorization", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Integer_factorization", "class": null, "target": "_blank"}}]}, {"text": ", for example, which goes back to ", "type": "text"}, {"text": "Euclid", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Euclid", "class": null, "target": "_blank"}}]}, {"text": " in 300 BC, had no practical application before its use in the ", "type": "text"}, {"text": "RSA cryptosystem", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/RSA_cryptosystem", "class": "mw-redirect", "target": "_blank"}}]}, {"text": ", now widely used for the security of ", "type": "text"}, {"text": "computer networks", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Computer_network", "class": null, "target": "_blank"}}]}, {"text": ".", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": "start"}, "content": [{"text": "Historically, the concept of a proof and its associated ", "type": "text"}, {"text": "mathematical rigour", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematical_rigour", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " first appeared in ", "type": "text"}, {"text": "Greek mathematics", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Greek_mathematics", "class": null, "target": "_blank"}}]}, {"text": ", most notably in Euclid's ", "type": "text"}, {"text": "Elements", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Euclid%27s_Elements", "class": null, "target": "_blank"}}, {"type": "italic"}]}, {"text": ".", "type": "text"}, {"text": "[8]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-8", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": " Since its beginning, mathematics was essentially divided into geometry and ", "type": "text"}, {"text": "arithmetic", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Arithmetic", "class": null, "target": "_blank"}}]}, {"text": " (the manipulation of ", "type": "text"}, {"text": "natural numbers", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Natural_number", "class": null, "target": "_blank"}}]}, {"text": " and ", "type": "text"}, {"text": "fractions", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Fraction_(mathematics)", "class": "mw-redirect", "target": "_blank"}}]}, {"text": "), until the 16th and 17th centuries, when algebra", "type": "text"}, {"text": "[a]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-9", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": " and ", "type": "text"}, {"text": "infinitesimal calculus", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Infinitesimal_calculus", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " were introduced as new areas. Since then, the interaction between mathematical innovations and ", "type": "text"}, {"text": "scientific discoveries", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Timeline_of_scientific_discoveries", "class": null, "target": "_blank"}}]}, {"text": " has led to a rapid lockstep increase in the development of both.", "type": "text"}, {"text": "[9]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-10", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": " At the end of the 19th century, the ", "type": "text"}, {"text": "foundational crisis of mathematics", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Foundational_crisis_of_mathematics", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " led to the systematization of the ", "type": "text"}, {"text": "axiomatic method", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Axiomatic_method", "class": "mw-redirect", "target": "_blank"}}]}, {"text": ",", "type": "text"}, {"text": "[10]", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics#cite_note-Kleiner_1991-11", "class": null, "target": "_blank"}}, {"type": "superscript"}]}, {"text": " which heralded a dramatic increase in the number of mathematical areas and their fields of application. The contemporary ", "type": "text"}, {"text": "Mathematics Subject Classification", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mathematics_Subject_Classification", "class": null, "target": "_blank"}}]}, {"text": " lists more than 60 first-level areas of mathematics.", "type": "text"}]}]}	t	clj9qzrqv000wcnnw2ooobgx9	2023-06-24 19:00:56.043	2023-06-24 19:22:19.665	{"\\"configxgt@gmail.com\\""}
cljac9ltt0001cnzdf38joxrw	math	\N	f	clj9qzrqv000wcnnw2ooobgx9	2023-06-24 18:32:55.745	2023-06-24 18:32:55.745	{}
clja6myxq0001cnnhu42xq1bz	yes sir	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1, "textAlign": "left"}, "content": [{"text": "A ", "type": "text"}, {"text": "computer", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "paragraph", "attrs": {"textAlign": "left"}, "content": [{"text": "is a ", "type": "text"}, {"text": "machine", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Machine", "class": null, "target": "_blank"}}]}, {"text": " that can be programmed to ", "type": "text"}, {"text": "carry out", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Execution_(computing)", "class": null, "target": "_blank"}}]}, {"text": " sequences of ", "type": "text"}, {"text": "arithmetic", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Arithmetic", "class": null, "target": "_blank"}}]}, {"text": " or ", "type": "text"}, {"text": "logical operations", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Logical_operations", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " (", "type": "text"}, {"text": "computation", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Computation", "class": null, "target": "_blank"}}]}, {"text": ") automatically. Modern ", "type": "text"}, {"text": "digital electronic", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Digital_electronic", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " computers can perform generic sets of operations known as ", "type": "text"}, {"text": "programs", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Computer_program", "class": null, "target": "_blank"}}]}, {"text": ". These programs enable computers to perform a wide range of tasks. A ", "type": "text"}, {"text": "computer system", "type": "text", "marks": [{"type": "bold"}]}, {"text": " is a nominally complete computer that includes the ", "type": "text"}, {"text": "hardware", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Computer_hardware", "class": null, "target": "_blank"}}]}, {"text": ", ", "type": "text"}, {"text": "operating system", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Operating_system", "class": null, "target": "_blank"}}]}, {"text": " (main ", "type": "text"}, {"text": "software", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Software", "class": null, "target": "_blank"}}]}, {"text": "), and ", "type": "text"}, {"text": "peripheral", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Peripheral", "class": null, "target": "_blank"}}]}, {"text": " equipment needed and used for full operation. This term may also refer to a group of computers that are linked and function together, such as a ", "type": "text"}, {"text": "computer network", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Computer_network", "class": null, "target": "_blank"}}]}, {"text": " or ", "type": "text"}, {"text": "computer cluster", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Computer_cluster", "class": null, "target": "_blank"}}]}, {"text": ".", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": "start"}, "content": [{"text": "A broad range of ", "type": "text"}, {"text": "industrial", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Programmable_logic_controller", "class": null, "target": "_blank"}}]}, {"text": " and ", "type": "text"}, {"text": "consumer products", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Consumer_electronics", "class": null, "target": "_blank"}}]}, {"text": " use computers as ", "type": "text"}, {"text": "control systems", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Control_system", "class": null, "target": "_blank"}}]}, {"text": ". Simple special-purpose devices like ", "type": "text"}, {"text": "microwave ovens", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Microwave_oven", "class": null, "target": "_blank"}}]}, {"text": " and ", "type": "text"}, {"text": "remote controls", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Remote_control", "class": null, "target": "_blank"}}]}, {"text": " are included, as are factory devices like ", "type": "text"}, {"text": "industrial robots", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Industrial_robot", "class": null, "target": "_blank"}}]}, {"text": " and ", "type": "text"}, {"text": "computer-aided design", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Computer-aided_design", "class": null, "target": "_blank"}}]}, {"text": ", as well as general-purpose devices like ", "type": "text"}, {"text": "personal computers", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Personal_computer", "class": null, "target": "_blank"}}]}, {"text": " and ", "type": "text"}, {"text": "mobile devices", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Mobile_device", "class": null, "target": "_blank"}}]}, {"text": " like ", "type": "text"}, {"text": "smartphones", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Smartphone", "class": null, "target": "_blank"}}]}, {"text": ". Computers power the ", "type": "text"}, {"text": "Internet", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Internet", "class": null, "target": "_blank"}}]}, {"text": ", which links billions of other computers and users.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": "start"}, "content": [{"text": "Early computers were meant to be used only for calculations. Simple manual instruments like the ", "type": "text"}, {"text": "abacus", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Abacus", "class": null, "target": "_blank"}}]}, {"text": " have aided people in doing calculations since ancient times. Early in the ", "type": "text"}, {"text": "Industrial Revolution", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Industrial_Revolution", "class": null, "target": "_blank"}}]}, {"text": ", some mechanical devices were built to automate long, tedious tasks, such as guiding patterns for ", "type": "text"}, {"text": "looms", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Loom", "class": null, "target": "_blank"}}]}, {"text": ". More sophisticated electrical machines did specialized ", "type": "text"}, {"text": "analog", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Analogue_electronics", "class": null, "target": "_blank"}}]}, {"text": " calculations in the early 20th century. The first ", "type": "text"}, {"text": "digital", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Digital_data", "class": null, "target": "_blank"}}]}, {"text": " electronic calculating machines were developed during ", "type": "text"}, {"text": "World War II", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/World_War_II", "class": null, "target": "_blank"}}]}, {"text": ". The first ", "type": "text"}, {"text": "semiconductor", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Semiconductor", "class": null, "target": "_blank"}}]}, {"text": " ", "type": "text"}, {"text": "transistors", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Transistor", "class": null, "target": "_blank"}}]}, {"text": " in the late 1940s were followed by the ", "type": "text"}, {"text": "silicon", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Silicon", "class": null, "target": "_blank"}}]}, {"text": "-based ", "type": "text"}, {"text": "MOSFET", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/MOSFET", "class": null, "target": "_blank"}}]}, {"text": " (MOS transistor) and ", "type": "text"}, {"text": "monolithic integrated circuit", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Monolithic_integrated_circuit", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " chip technologies in the late 1950s, leading to the ", "type": "text"}, {"text": "microprocessor", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Microprocessor", "class": null, "target": "_blank"}}]}, {"text": " and the ", "type": "text"}, {"text": "microcomputer revolution", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Microcomputer_revolution", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " in the 1970s. The speed, power and versatility of computers have been increasing dramatically ever since then, with ", "type": "text"}, {"text": "transistor counts", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Transistor_count", "class": null, "target": "_blank"}}]}, {"text": " increasing at a rapid pace (as predicted by ", "type": "text"}, {"text": "Moore's law", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Moore%27s_law", "class": null, "target": "_blank"}}]}, {"text": "), leading to the ", "type": "text"}, {"text": "Digital Revolution", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Digital_Revolution", "class": null, "target": "_blank"}}]}, {"text": " during the late 20th to early 21st centuries.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": "start"}, "content": [{"text": "Conventionally, a modern computer consists of at least one ", "type": "text"}, {"text": "processing element", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Processing_element", "class": "mw-redirect", "target": "_blank"}}]}, {"text": ", typically a ", "type": "text"}, {"text": "central processing unit", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Central_processing_unit", "class": null, "target": "_blank"}}]}, {"text": " (CPU) in the form of a microprocessor, along with some type of ", "type": "text"}, {"text": "computer memory", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Computer_memory", "class": null, "target": "_blank"}}]}, {"text": ", typically ", "type": "text"}, {"text": "semiconductor memory", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Semiconductor_memory", "class": null, "target": "_blank"}}]}, {"text": " chips. The processing element carries out arithmetic and logical operations, and a sequencing and control unit can change the order of operations in response to stored ", "type": "text"}, {"text": "information", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Data", "class": null, "target": "_blank"}}]}, {"text": ". Peripheral devices include input devices (keyboards, mice, ", "type": "text"}, {"text": "joystick", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Joystick", "class": null, "target": "_blank"}}]}, {"text": ", etc.), output devices (monitor screens, ", "type": "text"}, {"text": "printers", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Printer_(computing)", "class": null, "target": "_blank"}}]}, {"text": ", etc.), and input/output devices that perform both functions (e.g., the 2000s-era ", "type": "text"}, {"text": "touchscreen", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Touchscreen", "class": null, "target": "_blank"}}]}, {"text": "). Peripheral devices allow information to be retrieved from an external source and they enable the result of operations to be saved and retrieved.", "type": "text"}]}]}	t	clj9qzrqv000wcnnw2ooobgx9	2023-06-24 15:55:21.567	2023-06-24 18:53:26.055	{}
\.


--
-- TOC entry 3368 (class 0 OID 19213)
-- Dependencies: 214
-- Data for Name: Item; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."Item" (id, question, answer, "collectionId", "order", "createdAt", "updatedAt") FROM stdin;
clja6onah0007cnnhmpj3b7tl	What allows information to be retrieved from an external source and the result of operations to be saved and retrieved?	Peripheral devices allow information to be retrieved from an external source and they enable the result of operations to be saved and retrieved.	clja6myxq0001cnnhu42xq1bz	5	2023-06-24 15:56:39.786	2023-06-24 15:57:57.068
clja6onah0003cnnhorxarzcs	What components are typically found in a modern computer?	A modern computer typically includes at least one processing element, typically a central processing unit (CPU) in the form of a microprocessor, along with some type of computer memory, typically semiconductor memory chips.	clja6myxq0001cnnhu42xq1bz	1	2023-06-24 15:56:39.786	2023-06-24 15:57:43.683
clja6onah0004cnnhgnpnn0i0	What technologies have enabled the microprocessor and microcomputer revolution?	The first semiconductor transistors in the late 1940s were followed by the silicon-based MOSFET (MOS transistor) and monolithic integrated circuit chip technologies in the late 1950s, leading to the microprocessor and microcomputer revolution in the 1970s.	clja6myxq0001cnnhu42xq1bz	2	2023-06-24 15:56:39.786	2023-06-24 15:57:39.234
clja6onah0005cnnhg8ohqckn	What other devices are included in the range of products that use computers as controllers?	Simple special-purpose devices like microwave ovens and remote controls, factory devices like industrial robots and computer-aided design, as well as general-purpose devices like personal computers and mobile devices like smartphones are included in the range of products that use computers as controllers.	clja6myxq0001cnnhu42xq1bz	3	2023-06-24 15:56:39.786	2023-06-24 15:57:50.149
clja6onah0006cnnhzgs9bdvk	What has been the consequence of the development of computers over time?	The speed, power and versatility of computers have been increasing dramatically over time, with transistor counts increasing at a rapid pace (as predicted by Moore's law), leading to the Digital Revolution during the late 20th to early 21st centuries.	clja6myxq0001cnnhu42xq1bz	4	2023-06-24 15:56:39.786	2023-06-24 15:57:53.608
clja6onah0002cnnhcoyk9wy7	What is a computer?	A computer is a machine that can be programmed to carry out sequences of arithmetic or logical operations (computation) automatically.	clja6myxq0001cnnhu42xq1bz	0	2023-06-24 15:56:39.786	2023-06-24 15:58:18.634
clja6onah0008cnnhhlb424hi	How did computers get their start?	Early computers were meant to be used only for calculations. Simple manual instruments like the abacus have aided people in doing calculations since ancient times.	clja6myxq0001cnnhu42xq1bz	6	2023-06-24 15:56:39.786	2023-06-24 15:58:00.66
clja6onah0009cnnh7eimjn9n	What has enabled communication between billions of other computers and users?	Computers power the Internet, which links billions of other computers and users.	clja6myxq0001cnnhu42xq1bz	7	2023-06-24 15:56:39.786	2023-06-24 15:58:03.828
clja6onah000acnnhamdrc0dz	What type of calculations did early computers do?	Early computers were meant to be used only for calculations.	clja6myxq0001cnnhu42xq1bz	8	2023-06-24 15:56:39.786	2023-06-24 15:58:07.756
cljadac6h0008cnmy4s3glbtr	What is the purpose of mathematics?	Mathematics is essential in the natural sciences, engineering, medicine, finance, computer science and the social sciences, and is used for modeling phenomena.	cljad9mcr0001cnmymgwlcogd	6	2023-06-24 19:01:29.513	2023-06-24 19:01:46.856
cljadac6h0009cnmyz6qjd0fy	What is the relationship between mathematical innovations and scientific discoveries?	There is a rapid lockstep increase in the development of both.	cljad9mcr0001cnmymgwlcogd	7	2023-06-24 19:01:29.513	2023-06-24 19:01:50.36
cljadac6h000acnmy006qlyzs	What is an example of a problem that had no practical application before its use in modern technology?	The problem of integer factorization, which goes back to Euclid, had no practical application before its use in the RSA cryptosystem.	cljad9mcr0001cnmymgwlcogd	8	2023-06-24 19:01:29.513	2023-06-24 19:01:54.937
cljadac6h000bcnmy9j0jc6x2	What is the origin of mathematics?	Mathematics has been studied since antiquity. It began with the Ancient Greeks and continued with developments in European mathematics up to the present day.	cljad9mcr0001cnmymgwlcogd	9	2023-06-24 19:01:29.513	2023-06-24 19:02:00.273
cljac38qw0003cnkzf4w93bkp	Hello World	Hi	clja6myxq0001cnnhu42xq1bz	8	2023-06-24 18:27:58.857	2023-06-24 18:28:05.617
cljadac6h0002cnmy5n14vmrh	What topics are represented in modern mathematics?	Number theory, algebra, geometry, and analysis.	cljad9mcr0001cnmymgwlcogd	0	2023-06-24 19:01:29.513	2023-06-24 19:01:29.513
cljadac6h0003cnmyeijwr38k	What is a proof?	A proof consists of a succession of applications of deductive rules to already established results, such as theorems, axioms, and basic properties.	cljad9mcr0001cnmymgwlcogd	1	2023-06-24 19:01:29.513	2023-06-24 19:01:29.513
cljadac6h0004cnmye5eeiuvk	What areas of mathematics are developed independently from any application?	Pure mathematics.	cljad9mcr0001cnmymgwlcogd	2	2023-06-24 19:01:29.513	2023-06-24 19:01:29.513
cljadac6h0005cnmyyvoibgfn	When did the concept of a proof and its associated mathematical rigour first appear?	In Greek mathematics, most notably in Euclid's Elements.	cljad9mcr0001cnmymgwlcogd	3	2023-06-24 19:01:29.513	2023-06-24 19:01:29.513
cljadac6h0006cnmya4sj2eoq	What led to a dramatic increase in the number of mathematical areas and their fields of application?	The systematization of the axiomatic method at the end of the 19th century.	cljad9mcr0001cnmymgwlcogd	4	2023-06-24 19:01:29.513	2023-06-24 19:01:39.868
cljadac6h0007cnmygyd8d7zm	How many first-level areas of mathematics are listed in the contemporary Mathematics Subject Classification?	More than 60.	cljad9mcr0001cnmymgwlcogd	5	2023-06-24 19:01:29.513	2023-06-24 19:01:43.253
\.


--
-- TOC entry 3364 (class 0 OID 19185)
-- Dependencies: 210
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
cljabsura0001cnkzpmvt87dk	6c3befd2-10cf-4fed-b0b4-5f8c6388a601	clj9qzrqv000wcnnw2ooobgx9	2023-07-24 18:19:54.162
\.


--
-- TOC entry 3365 (class 0 OID 19192)
-- Dependencies: 211
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."User" (id, name, email, "emailVerified", image) FROM stdin;
clj9qzrqv000wcnnw2ooobgx9	Edqe_	configxgt@gmail.com	\N	https://lh3.googleusercontent.com/a/AAcHTtc7-tIcA8thPkee87RBAKH1Fa6bI-jtTpqszlyJlw=s96-c
\.


--
-- TOC entry 3366 (class 0 OID 19199)
-- Dependencies: 212
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- TOC entry 3206 (class 2606 OID 19184)
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- TOC entry 3217 (class 2606 OID 19212)
-- Name: Collection Collection_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Collection"
    ADD CONSTRAINT "Collection_pkey" PRIMARY KEY (id);


--
-- TOC entry 3219 (class 2606 OID 19220)
-- Name: Item Item_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_pkey" PRIMARY KEY (id);


--
-- TOC entry 3209 (class 2606 OID 19191)
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- TOC entry 3213 (class 2606 OID 19198)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 3207 (class 1259 OID 19228)
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- TOC entry 3210 (class 1259 OID 19229)
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- TOC entry 3211 (class 1259 OID 19230)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 3214 (class 1259 OID 19232)
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- TOC entry 3215 (class 1259 OID 19231)
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- TOC entry 3220 (class 2606 OID 19233)
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3222 (class 2606 OID 19243)
-- Name: Collection Collection_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Collection"
    ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3223 (class 2606 OID 19248)
-- Name: Item Item_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3221 (class 2606 OID 19238)
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2023-06-25 02:24:47 +07

--
-- PostgreSQL database dump complete
--

