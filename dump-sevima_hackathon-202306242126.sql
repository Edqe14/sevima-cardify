--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6
-- Dumped by pg_dump version 14.6

-- Started on 2023-06-24 21:26:39 +07

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
-- TOC entry 215 (class 1259 OID 19221)
-- Name: AccessList; Type: TABLE; Schema: public; Owner: edqe
--

CREATE TABLE public."AccessList" (
    id text NOT NULL,
    "collectionId" text NOT NULL,
    email text NOT NULL
);


ALTER TABLE public."AccessList" OWNER TO edqe;

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
    "updatedAt" timestamp(3) without time zone NOT NULL
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
-- TOC entry 3375 (class 0 OID 19221)
-- Dependencies: 215
-- Data for Name: AccessList; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."AccessList" (id, "collectionId", email) FROM stdin;
\.


--
-- TOC entry 3369 (class 0 OID 19178)
-- Dependencies: 209
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", "refreshToken", "accessToken", "expiresAt", "tokenType", scope, "idToken", "sessionState") FROM stdin;
clj9qzrr6000zcnnwot1jvm1w	clj9qzrqv000wcnnw2ooobgx9	oauth	google	102500504533523610958	\N	ya29.a0AWY7CkkdRvpcH_mGyS4nxCG8h-mqIpN9QnJVgLZc-2OlFRTrLPQ0Nb-dezbHTfhvWH87M38QT5vJQUs2bNC4Fy4CiQ2zfvoBDwpgPPY5OA1aJB54ZZX8E3O5An2IG4dGCxFdBv7p4SHIYKCEj2lbJWmo7yjmaCgYKAUcSARISFQG1tDrpcAw57QUa73qiu8p9iVRxbA0163	1687599443	Bearer	openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email	eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk5YmNiMDY5MzQwYTNmMTQ3NDYyNzk0ZGZlZmE3NWU3OTk2MTM2MzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2NTkzNDU3NjYwMjEtN3NxbWhlYmNkNjVpOXJnc3AwbGN0Z2ZjcWZoOGFxN2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2NTkzNDU3NjYwMjEtN3NxbWhlYmNkNjVpOXJnc3AwbGN0Z2ZjcWZoOGFxN2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI1MDA1MDQ1MzM1MjM2MTA5NTgiLCJlbWFpbCI6ImNvbmZpZ3hndEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkxEd0RyNERiTndNNlVpdlNkOGxBdmciLCJuYW1lIjoiRWRxZV8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0YzctdEljQTh0aFBrZWU4N1JCQUtIMUZhNmJJLWp0VHBxc3pseUpsdz1zOTYtYyIsImdpdmVuX25hbWUiOiJFZHFlXyIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjg3NTk1ODQ0LCJleHAiOjE2ODc1OTk0NDR9.gJpiDI9-Jg8vc5MJNjoN295XZWqD6MXVD0DJfYzZIx8xkr3_FSAjMM26wB-J7OHWba9s_tIzTnRJ5iufR7IN4E-N-zlZIEEnEKm9DB605Xzb9YS4quTmgt-jhvUFGYFReQ3o9TSyhlj3m74QEneqiFqLdEzx0lp6sIdw_IZq-pW2vtnmLZ6FlWseZ8mh58FC-eVBtEV_uQRM0nJSYfIcqX-3LvVcgQJCRLFnukBXyE1rLZpw_r_YZ_NlEg5FKdA2befZyFMmFj8RR89hXO09QaniHKGrP4EIPe01U0iHAyYb1lCOQJDQUaTdO3YwwsMHhPUYnDL2ceD8MoI7xKZdCQ	\N
\.


--
-- TOC entry 3373 (class 0 OID 19204)
-- Dependencies: 213
-- Data for Name: Collection; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."Collection" (id, name, document, public, "userId", "createdAt", "updatedAt") FROM stdin;
clj9r0axo0013cnnw89drcxtz	habit dawn secret	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"textAlign": "left"}, "content": [{"text": "The Holocaust", "type": "text", "marks": [{"type": "bold"}]}, {"text": " was the ", "type": "text"}, {"text": "genocide", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Genocide", "class": null, "target": "_blank"}}]}, {"text": " of ", "type": "text"}, {"text": "European Jews", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/History_of_the_Jews_in_Europe", "class": null, "target": "_blank"}}]}, {"text": " during ", "type": "text"}, {"text": "World War II", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/World_War_II", "class": null, "target": "_blank"}}]}, {"text": ". Between 1941 and 1945, ", "type": "text"}, {"text": "Nazi Germany", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Nazi_Germany", "class": null, "target": "_blank"}}]}, {"text": " and ", "type": "text"}, {"text": "its collaborators", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Collaboration_with_Nazi_Germany", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " systematically murdered some ", "type": "text"}, {"text": "six million Jews", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Holocaust_victims", "class": null, "target": "_blank"}}]}, {"text": " across ", "type": "text"}, {"text": "German-occupied Europe", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/German-occupied_Europe", "class": null, "target": "_blank"}}]}, {"text": ", around two-thirds of Europe's Jewish population. The murders were carried out primarily through ", "type": "text"}, {"text": "mass shootings", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/The_Holocaust#Mass_shootings", "class": null, "target": "_blank"}}]}, {"text": " and poison gas in ", "type": "text"}, {"text": "extermination camps", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Extermination_camp", "class": null, "target": "_blank"}}]}, {"text": ", chiefly ", "type": "text"}, {"text": "Auschwitz-Birkenau", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Auschwitz_concentration_camp#Auschwitz_II-Birkenau", "class": null, "target": "_blank"}}]}, {"text": ", ", "type": "text"}, {"text": "Treblinka", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Treblinka_extermination_camp", "class": null, "target": "_blank"}}]}, {"text": ", ", "type": "text"}, {"text": "Belzec", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Belzec_extermination_camp", "class": null, "target": "_blank"}}]}, {"text": ", ", "type": "text"}, {"text": "Sobibor", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Sobibor_extermination_camp", "class": null, "target": "_blank"}}]}, {"text": ", and ", "type": "text"}, {"text": "Chełmno", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Che%C5%82mno_extermination_camp", "class": null, "target": "_blank"}}]}, {"text": " in ", "type": "text"}, {"text": "occupied Poland", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Occupation_of_Poland_(1939%E2%80%931945)", "class": null, "target": "_blank"}}]}, {"text": ".", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": "start"}, "content": [{"text": "The Nazis developed ", "type": "text"}, {"text": "their ideology", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Nazism", "class": null, "target": "_blank"}}]}, {"text": " based on previous politics of racism and ", "type": "text"}, {"text": "German colonization of Eastern Europe", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Lebensraum", "class": null, "target": "_blank"}}]}, {"text": " and ", "type": "text"}, {"text": "seized power", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Adolf_Hitler%27s_rise_to_power", "class": null, "target": "_blank"}}]}, {"text": " in early 1933. In an attempt to ", "type": "text"}, {"text": "force all German Jews to emigrate", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Emigration_of_Jews_from_Nazi_Germany_and_German-occupied_Europe", "class": null, "target": "_blank"}}]}, {"text": ", the regime passed anti-Jewish laws and orchestrated a ", "type": "text"}, {"text": "nationwide pogrom", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Kristallnacht", "class": null, "target": "_blank"}}]}, {"text": " in November 1938. After Germany ", "type": "text"}, {"text": "invaded Poland", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Invasion_of_Poland", "class": null, "target": "_blank"}}]}, {"text": " in September 1939, occupation authorities began to establish ", "type": "text"}, {"text": "ghettos", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Nazi_ghettos", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " to segregate Jews. Following the ", "type": "text"}, {"text": "invasion of the Soviet Union", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Invasion_of_the_Soviet_Union", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " in June 1941, around 1.5 to 2 million Jews ", "type": "text"}, {"text": "were shot", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/The_Holocaust#Mass_shootings_of_Jews", "class": "mw-selflink-fragment", "target": "_blank"}}]}, {"text": " by German forces and local collaborators.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": "left"}, "content": [{"text": "Later in 1941 or early 1942, the highest levels of the German government decided to ", "type": "text"}, {"text": "murder all Jews throughout Europe", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Final_Solution", "class": null, "target": "_blank"}}]}, {"text": ". Victims were deported by rail to extermination camps where, if they survived the journey, most were killed with poison gas. Other Jews continued to be employed in ", "type": "text"}, {"text": "forced labor camps", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Forced_labor_in_Nazi_Germany", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " where many died from starvation or exhaustion. Although many Jews tried to escape, surviving in hiding was very difficult due to factors such as the lack of money to pay helpers and the risk of denunciation. The property, homes, and jobs belonging to murdered Jews were redistributed to the German occupiers and other non-Jews. Although the majority of Holocaust victims died in 1942, the killing continued at a lower rate until the ", "type": "text"}, {"text": "end of the war", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/End_of_World_War_II_in_Europe", "class": null, "target": "_blank"}}]}, {"text": " in May 1945.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": "start"}, "content": [{"text": "The Nazi regime and its allies also killed millions of non-Jews, although Jews made up the majority of the civilian war-related deaths in some European countries. Many ", "type": "text"}, {"text": "Jewish survivors", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Holocaust_survivors", "class": null, "target": "_blank"}}]}, {"text": " emigrated outside of Europe after the war. A few ", "type": "text"}, {"text": "Holocaust perpetrators", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Holocaust_perpetrators", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " faced criminal trials. Billions of dollars in ", "type": "text"}, {"text": "reparations", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/Holocaust_reparations", "class": "mw-redirect", "target": "_blank"}}]}, {"text": " have been paid, although falling short of the Jews' losses. The Holocaust has also been commemorated in ", "type": "text"}, {"text": "museums, memorials", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/List_of_Holocaust_memorials_and_museums", "class": null, "target": "_blank"}}]}, {"text": ", and ", "type": "text"}, {"text": "culture", "type": "text", "marks": [{"type": "link", "attrs": {"href": "https://en.wikipedia.org/wiki/The_Holocaust_in_the_arts_and_popular_culture", "class": null, "target": "_blank"}}]}, {"text": ". It has become central to Western historical consciousness as a symbol of the ultimate human evil.", "type": "text"}]}]}	t	clj9qzrqv000wcnnw2ooobgx9	2023-06-24 08:37:49.788	2023-06-24 13:23:37.877
\.


--
-- TOC entry 3374 (class 0 OID 19213)
-- Dependencies: 214
-- Data for Name: Item; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."Item" (id, question, answer, "collectionId", "order", "createdAt", "updatedAt") FROM stdin;
clj9r59mn0002cnu17bj9dvvt	What was the Holocaust?	The Holocaust was the genocide of European Jews during World War II. really now?	clj9r0axo0013cnnw89drcxtz	0	2023-06-24 08:41:41.376	2023-06-24 10:55:04.252
clj9r59mo0009cnu1uq5k4mmb	Where did victims of the Holocaust typically end up?	Victims were deported by rail to extermination camps where, if they survived the journey, most were killed with poison gas. Other Jews continued to be employed in forced labor camps where many died from starvation or exhaustion.	clj9r0axo0013cnnw89drcxtz	6	2023-06-24 08:41:41.376	2023-06-24 13:13:57.911
clj9r59mo000acnu163xyjl7x	What happened to the property and jobs of murdered Jews?	The property, homes, and jobs belonging to murdered Jews were redistributed to the German occupiers and other non-Jews.	clj9r0axo0013cnnw89drcxtz	8	2023-06-24 08:41:41.376	2023-06-24 10:53:19.915
clj9r59mo000bcnu1h9fvruj6	When did the killing of Jews diminish?	Although the majority of Holocaust victims died in 1942, the killing continued at a lower rate until the end of the war in May 1945.	clj9r0axo0013cnnw89drcxtz	9	2023-06-24 08:41:41.376	2023-06-24 10:53:19.94
clj9r59mo0008cnu1x6hour7p	When did the highest levels of the German government decide to murder all Jews throughout Europe?	Later in 1941 or early 1942, the highest levels of the German government decided to murder all Jews throughout Europe.	clj9r0axo0013cnnw89drcxtz	7	2023-06-24 08:41:41.376	2023-06-24 13:13:57.911
clj9r59mo0004cnu1yi6xhja2	How were the Jews killed?	The murders were carried out primarily through mass shootings and poison gas in extermination camps, chiefly Auschwitz-Birkenau, Treblinka, Belzec, Sobibor, and Chełmno in occupied Poland.	clj9r0axo0013cnnw89drcxtz	1	2023-06-24 08:41:41.376	2023-06-24 10:53:19.944
clja0vosl0001cn0rmfg8rmo7	Do you like cake?	Yes 	clj9r0axo0013cnnw89drcxtz	9	2023-06-24 13:14:10.629	2023-06-24 13:17:13.746
clj9r59mo0003cnu1rmlezkfa	When did the Holocaust take place?	Between 1941 and 1945, Nazi Germany and its collaborators systematically murdered some six million Jews across German-occupied Europe, around two-thirds of Europe's Jewish population.	clj9r0axo0013cnnw89drcxtz	2	2023-06-24 08:41:41.376	2023-06-24 10:53:19.944
clj9r59mo0007cnu1ucjkbs45	When were Jews shot?	After Germany invaded Poland in September 1939, occupation authorities began to establish ghettos to segregate Jews. Following the invasion of the Soviet Union in June 1941, around 1.5 to 2 million Jews were shot by German forces and local collaborators.	clj9r0axo0013cnnw89drcxtz	5	2023-06-24 08:41:41.376	2023-06-24 10:53:19.968
clj9r59mo0006cnu1dm6lk40i	What happened in November 1938?	In an attempt to force all German Jews to emigrate, the regime passed anti-Jewish laws and orchestrated a nationwide pogrom in November 1938.	clj9r0axo0013cnnw89drcxtz	4	2023-06-24 08:41:41.376	2023-06-24 10:53:19.969
clj9r59mo0005cnu1wzo7mzh1	How did the Nazi regime come to power?	The Nazis developed their ideology based on previous politics of racism and German colonization of Eastern Europe and seized power in early 1933.	clj9r0axo0013cnnw89drcxtz	3	2023-06-24 08:41:41.376	2023-06-24 10:53:19.986
\.


--
-- TOC entry 3370 (class 0 OID 19185)
-- Dependencies: 210
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
clj9qzrrq0011cnnwaiz9ulxk	4d7a1199-f1f6-45d4-ab84-3f2e0a0ad242	clj9qzrqv000wcnnw2ooobgx9	2023-07-24 08:37:24.949
\.


--
-- TOC entry 3371 (class 0 OID 19192)
-- Dependencies: 211
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."User" (id, name, email, "emailVerified", image) FROM stdin;
clj9qzrqv000wcnnw2ooobgx9	Edqe_	configxgt@gmail.com	\N	https://lh3.googleusercontent.com/a/AAcHTtc7-tIcA8thPkee87RBAKH1Fa6bI-jtTpqszlyJlw=s96-c
\.


--
-- TOC entry 3372 (class 0 OID 19199)
-- Dependencies: 212
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: edqe
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- TOC entry 3224 (class 2606 OID 19227)
-- Name: AccessList AccessList_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."AccessList"
    ADD CONSTRAINT "AccessList_pkey" PRIMARY KEY (id);


--
-- TOC entry 3209 (class 2606 OID 19184)
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- TOC entry 3220 (class 2606 OID 19212)
-- Name: Collection Collection_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Collection"
    ADD CONSTRAINT "Collection_pkey" PRIMARY KEY (id);


--
-- TOC entry 3222 (class 2606 OID 19220)
-- Name: Item Item_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_pkey" PRIMARY KEY (id);


--
-- TOC entry 3212 (class 2606 OID 19191)
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- TOC entry 3216 (class 2606 OID 19198)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 3210 (class 1259 OID 19228)
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- TOC entry 3213 (class 1259 OID 19229)
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- TOC entry 3214 (class 1259 OID 19230)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 3217 (class 1259 OID 19232)
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- TOC entry 3218 (class 1259 OID 19231)
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: edqe
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- TOC entry 3229 (class 2606 OID 19253)
-- Name: AccessList AccessList_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."AccessList"
    ADD CONSTRAINT "AccessList_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3225 (class 2606 OID 19233)
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3227 (class 2606 OID 19243)
-- Name: Collection Collection_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Collection"
    ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3228 (class 2606 OID 19248)
-- Name: Item Item_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3226 (class 2606 OID 19238)
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: edqe
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2023-06-24 21:26:40 +07

--
-- PostgreSQL database dump complete
--

