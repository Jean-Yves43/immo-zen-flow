--
-- PostgreSQL database dump
--

\restrict 14mpWGMEKgcI0mIYjTAglrg7NVb5gJ0ohOdNRHo2qrHS2XNIYilqyLBYa2cZfIK

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-19 18:54:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5325 (class 1262 OID 16388)
-- Name: immoGestion; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "immoGestion" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'French_France.1252';


ALTER DATABASE "immoGestion" OWNER TO postgres;

\unrestrict 14mpWGMEKgcI0mIYjTAglrg7NVb5gJ0ohOdNRHo2qrHS2XNIYilqyLBYa2cZfIK
\connect "immoGestion"
\restrict 14mpWGMEKgcI0mIYjTAglrg7NVb5gJ0ohOdNRHo2qrHS2XNIYilqyLBYa2cZfIK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 240 (class 1259 OID 16566)
-- Name: biens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type_bien_id integer NOT NULL,
    ref character varying(50),
    statut character varying(50),
    description text,
    nbr_pieces integer,
    prix_apt numeric(15,2),
    nbr_etage integer,
    nbr_chambres integer,
    annee_construction integer,
    nbr_lots_copropriete integer,
    image bytea,
    longitude numeric(11,8),
    latitude numeric(10,8),
    pays character varying(100),
    balcon boolean DEFAULT false,
    jardin boolean DEFAULT false,
    parking boolean DEFAULT false,
    garage boolean DEFAULT false,
    terrasse boolean DEFAULT false,
    piscine boolean DEFAULT false,
    equipee boolean DEFAULT false,
    ascenseur boolean DEFAULT false,
    gardien boolean DEFAULT false,
    surface numeric(10,2),
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    quartier_id integer
);


ALTER TABLE public.biens OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16565)
-- Name: biens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.biens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.biens_id_seq OWNER TO postgres;

--
-- TOC entry 5326 (class 0 OID 0)
-- Dependencies: 239
-- Name: biens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.biens_id_seq OWNED BY public.biens.id;


--
-- TOC entry 230 (class 1259 OID 16479)
-- Name: commune; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commune (
    id integer NOT NULL,
    ville_id integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.commune OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16478)
-- Name: commune_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commune_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commune_id_seq OWNER TO postgres;

--
-- TOC entry 5327 (class 0 OID 0)
-- Dependencies: 229
-- Name: commune_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commune_id_seq OWNED BY public.commune.id;


--
-- TOC entry 226 (class 1259 OID 16441)
-- Name: departement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departement (
    id integer NOT NULL,
    region_id integer NOT NULL,
    nom character varying(100) NOT NULL,
    departement_capital character varying(100),
    description text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departement OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16440)
-- Name: departement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departement_id_seq OWNER TO postgres;

--
-- TOC entry 5328 (class 0 OID 0)
-- Dependencies: 225
-- Name: departement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departement_id_seq OWNED BY public.departement.id;


--
-- TOC entry 222 (class 1259 OID 16403)
-- Name: district; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.district (
    id integer NOT NULL,
    pays_id integer NOT NULL,
    nom character varying(100) NOT NULL,
    district_capital character varying(100),
    description text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.district OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16402)
-- Name: district_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.district_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.district_id_seq OWNER TO postgres;

--
-- TOC entry 5329 (class 0 OID 0)
-- Dependencies: 221
-- Name: district_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.district_id_seq OWNED BY public.district.id;


--
-- TOC entry 250 (class 1259 OID 16691)
-- Name: expulsion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expulsion (
    id integer NOT NULL,
    location_id integer NOT NULL,
    mise_en_demeure_id integer,
    date_demande_expulsion date,
    date_expulsion_prevu date,
    date_expulsion_effective date,
    cout numeric(15,2),
    statut character varying(50),
    montant_recupere numeric(15,2),
    description text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.expulsion OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16690)
-- Name: expulsion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expulsion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expulsion_id_seq OWNER TO postgres;

--
-- TOC entry 5330 (class 0 OID 0)
-- Dependencies: 249
-- Name: expulsion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expulsion_id_seq OWNED BY public.expulsion.id;


--
-- TOC entry 258 (class 1259 OID 16764)
-- Name: fiche_maintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiche_maintenance (
    id integer NOT NULL,
    tache_id integer NOT NULL,
    categorie character varying(50),
    urgence character varying(50),
    description text,
    statut character varying(50),
    date_demande date,
    date_resolution date,
    prestataire_id integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fiche_maintenance OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 16763)
-- Name: fiche_maintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fiche_maintenance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fiche_maintenance_id_seq OWNER TO postgres;

--
-- TOC entry 5331 (class 0 OID 0)
-- Dependencies: 257
-- Name: fiche_maintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fiche_maintenance_id_seq OWNED BY public.fiche_maintenance.id;


--
-- TOC entry 262 (class 1259 OID 16814)
-- Name: gestionnaire_proprietaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gestionnaire_proprietaire (
    id integer NOT NULL,
    gestionnaire_id integer NOT NULL,
    proprietaire_id integer NOT NULL,
    date_debut date DEFAULT CURRENT_DATE,
    date_fin date,
    statut character varying(50) DEFAULT 'ACTIF'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.gestionnaire_proprietaire OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 16813)
-- Name: gestionnaire_proprietaire_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gestionnaire_proprietaire_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gestionnaire_proprietaire_id_seq OWNER TO postgres;

--
-- TOC entry 5332 (class 0 OID 0)
-- Dependencies: 261
-- Name: gestionnaire_proprietaire_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gestionnaire_proprietaire_id_seq OWNED BY public.gestionnaire_proprietaire.id;


--
-- TOC entry 260 (class 1259 OID 16787)
-- Name: historique_prix; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historique_prix (
    id integer NOT NULL,
    bien_id integer NOT NULL,
    ancien_prix numeric(15,2),
    nouveau_prix numeric(15,2),
    date date,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historique_prix OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 16786)
-- Name: historique_prix_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historique_prix_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historique_prix_id_seq OWNER TO postgres;

--
-- TOC entry 5333 (class 0 OID 0)
-- Dependencies: 259
-- Name: historique_prix_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historique_prix_id_seq OWNED BY public.historique_prix.id;


--
-- TOC entry 242 (class 1259 OID 16606)
-- Name: location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location (
    id integer NOT NULL,
    bien_id integer NOT NULL,
    lat_2_mois numeric(25,10),
    contrat bytea,
    statut character varying(50),
    user_id integer,
    garant character varying(255),
    caution numeric(15,2),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.location OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16605)
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.location_id_seq OWNER TO postgres;

--
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 241
-- Name: location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.location_id_seq OWNED BY public.location.id;


--
-- TOC entry 248 (class 1259 OID 16670)
-- Name: mise_en_demeure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mise_en_demeure (
    id integer NOT NULL,
    location_id integer NOT NULL,
    relance_id integer,
    date_med date,
    montant_totale_du numeric(15,2),
    statut character varying(50),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mise_en_demeure OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16669)
-- Name: mise_en_demeure_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mise_en_demeure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mise_en_demeure_id_seq OWNER TO postgres;

--
-- TOC entry 5335 (class 0 OID 0)
-- Dependencies: 247
-- Name: mise_en_demeure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mise_en_demeure_id_seq OWNED BY public.mise_en_demeure.id;


--
-- TOC entry 252 (class 1259 OID 16714)
-- Name: paiements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paiements (
    id integer NOT NULL,
    location_id integer NOT NULL,
    montant numeric(15,2) NOT NULL,
    date_echeance date,
    date_paiement date,
    mode_paiement character varying(50),
    ref_trans character varying(100),
    motif text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.paiements OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16713)
-- Name: paiements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paiements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paiements_id_seq OWNER TO postgres;

--
-- TOC entry 5336 (class 0 OID 0)
-- Dependencies: 251
-- Name: paiements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paiements_id_seq OWNED BY public.paiements.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: pays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pays (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    localisation character varying(255),
    description text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pays OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: pays_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pays_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pays_id_seq OWNER TO postgres;

--
-- TOC entry 5337 (class 0 OID 0)
-- Dependencies: 219
-- Name: pays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pays_id_seq OWNED BY public.pays.id;


--
-- TOC entry 256 (class 1259 OID 16751)
-- Name: prestataire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prestataire (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    email character varying(255),
    specialite character varying(100),
    tel character varying(20),
    tarif numeric(15,2),
    type character varying(50),
    adresse text,
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    photo bytea
);


ALTER TABLE public.prestataire OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16750)
-- Name: prestataire_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prestataire_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prestataire_id_seq OWNER TO postgres;

--
-- TOC entry 5338 (class 0 OID 0)
-- Dependencies: 255
-- Name: prestataire_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prestataire_id_seq OWNED BY public.prestataire.id;


--
-- TOC entry 232 (class 1259 OID 16498)
-- Name: quartier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quartier (
    id integer NOT NULL,
    commune_id integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.quartier OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16497)
-- Name: quartier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quartier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quartier_id_seq OWNER TO postgres;

--
-- TOC entry 5339 (class 0 OID 0)
-- Dependencies: 231
-- Name: quartier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quartier_id_seq OWNED BY public.quartier.id;


--
-- TOC entry 224 (class 1259 OID 16422)
-- Name: region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region (
    id integer NOT NULL,
    district_id integer NOT NULL,
    nom character varying(100) NOT NULL,
    region_capital character varying(100),
    description text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.region OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16421)
-- Name: region_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.region_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.region_id_seq OWNER TO postgres;

--
-- TOC entry 5340 (class 0 OID 0)
-- Dependencies: 223
-- Name: region_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.region_id_seq OWNED BY public.region.id;


--
-- TOC entry 246 (class 1259 OID 16654)
-- Name: relance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relance (
    id integer NOT NULL,
    location_id integer NOT NULL,
    date_relance date,
    type_relance character varying(50),
    montant_du numeric(15,2),
    statut character varying(50),
    moyen_envoi character varying(50),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.relance OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16653)
-- Name: relance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.relance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.relance_id_seq OWNER TO postgres;

--
-- TOC entry 5341 (class 0 OID 0)
-- Dependencies: 245
-- Name: relance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.relance_id_seq OWNED BY public.relance.id;


--
-- TOC entry 236 (class 1259 OID 16528)
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    libelle character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.role OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16527)
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO postgres;

--
-- TOC entry 5342 (class 0 OID 0)
-- Dependencies: 235
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- TOC entry 254 (class 1259 OID 16733)
-- Name: taches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taches (
    id integer NOT NULL,
    location_id integer NOT NULL,
    type character varying(50),
    date_demande date,
    date_resolution date,
    motif text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.taches OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16732)
-- Name: taches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.taches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.taches_id_seq OWNER TO postgres;

--
-- TOC entry 5343 (class 0 OID 0)
-- Dependencies: 253
-- Name: taches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.taches_id_seq OWNED BY public.taches.id;


--
-- TOC entry 234 (class 1259 OID 16517)
-- Name: type_bien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_bien (
    id integer NOT NULL,
    libelle character varying(100) NOT NULL
);


ALTER TABLE public.type_bien OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16516)
-- Name: type_bien_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_bien_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_bien_id_seq OWNER TO postgres;

--
-- TOC entry 5344 (class 0 OID 0)
-- Dependencies: 233
-- Name: type_bien_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_bien_id_seq OWNED BY public.type_bien.id;


--
-- TOC entry 238 (class 1259 OID 16541)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    tel character varying(20),
    pswd character varying(255) NOT NULL,
    adresse text,
    photo bytea,
    statut character varying(50),
    role_id integer,
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    dob date,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    blocked boolean DEFAULT false,
    expired boolean DEFAULT false,
    nbr_essais integer DEFAULT 0
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16540)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5345 (class 0 OID 0)
-- Dependencies: 237
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 244 (class 1259 OID 16629)
-- Name: vente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vente (
    id integer NOT NULL,
    user_id integer NOT NULL,
    bien_id integer NOT NULL,
    prix numeric(15,2) NOT NULL,
    contrat bytea,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vente OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16628)
-- Name: vente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vente_id_seq OWNER TO postgres;

--
-- TOC entry 5346 (class 0 OID 0)
-- Dependencies: 243
-- Name: vente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vente_id_seq OWNED BY public.vente.id;


--
-- TOC entry 228 (class 1259 OID 16460)
-- Name: ville; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ville (
    id integer NOT NULL,
    departement_id integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modif timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ville OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16459)
-- Name: ville_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ville_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ville_id_seq OWNER TO postgres;

--
-- TOC entry 5347 (class 0 OID 0)
-- Dependencies: 227
-- Name: ville_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ville_id_seq OWNED BY public.ville.id;


--
-- TOC entry 4990 (class 2604 OID 16569)
-- Name: biens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biens ALTER COLUMN id SET DEFAULT nextval('public.biens_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 16482)
-- Name: commune id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commune ALTER COLUMN id SET DEFAULT nextval('public.commune_id_seq'::regclass);


--
-- TOC entry 4970 (class 2604 OID 16444)
-- Name: departement id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departement ALTER COLUMN id SET DEFAULT nextval('public.departement_id_seq'::regclass);


--
-- TOC entry 4964 (class 2604 OID 16406)
-- Name: district id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district ALTER COLUMN id SET DEFAULT nextval('public.district_id_seq'::regclass);


--
-- TOC entry 5014 (class 2604 OID 16694)
-- Name: expulsion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expulsion ALTER COLUMN id SET DEFAULT nextval('public.expulsion_id_seq'::regclass);


--
-- TOC entry 5026 (class 2604 OID 16767)
-- Name: fiche_maintenance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_maintenance ALTER COLUMN id SET DEFAULT nextval('public.fiche_maintenance_id_seq'::regclass);


--
-- TOC entry 5032 (class 2604 OID 16817)
-- Name: gestionnaire_proprietaire id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gestionnaire_proprietaire ALTER COLUMN id SET DEFAULT nextval('public.gestionnaire_proprietaire_id_seq'::regclass);


--
-- TOC entry 5029 (class 2604 OID 16790)
-- Name: historique_prix id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_prix ALTER COLUMN id SET DEFAULT nextval('public.historique_prix_id_seq'::regclass);


--
-- TOC entry 5002 (class 2604 OID 16609)
-- Name: location id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location ALTER COLUMN id SET DEFAULT nextval('public.location_id_seq'::regclass);


--
-- TOC entry 5011 (class 2604 OID 16673)
-- Name: mise_en_demeure id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mise_en_demeure ALTER COLUMN id SET DEFAULT nextval('public.mise_en_demeure_id_seq'::regclass);


--
-- TOC entry 5017 (class 2604 OID 16717)
-- Name: paiements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements ALTER COLUMN id SET DEFAULT nextval('public.paiements_id_seq'::regclass);


--
-- TOC entry 4961 (class 2604 OID 16393)
-- Name: pays id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pays ALTER COLUMN id SET DEFAULT nextval('public.pays_id_seq'::regclass);


--
-- TOC entry 5023 (class 2604 OID 16754)
-- Name: prestataire id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestataire ALTER COLUMN id SET DEFAULT nextval('public.prestataire_id_seq'::regclass);


--
-- TOC entry 4979 (class 2604 OID 16501)
-- Name: quartier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quartier ALTER COLUMN id SET DEFAULT nextval('public.quartier_id_seq'::regclass);


--
-- TOC entry 4967 (class 2604 OID 16425)
-- Name: region id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region ALTER COLUMN id SET DEFAULT nextval('public.region_id_seq'::regclass);


--
-- TOC entry 5008 (class 2604 OID 16657)
-- Name: relance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relance ALTER COLUMN id SET DEFAULT nextval('public.relance_id_seq'::regclass);


--
-- TOC entry 4983 (class 2604 OID 16531)
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- TOC entry 5020 (class 2604 OID 16736)
-- Name: taches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches ALTER COLUMN id SET DEFAULT nextval('public.taches_id_seq'::regclass);


--
-- TOC entry 4982 (class 2604 OID 16520)
-- Name: type_bien id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_bien ALTER COLUMN id SET DEFAULT nextval('public.type_bien_id_seq'::regclass);


--
-- TOC entry 4984 (class 2604 OID 16544)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5005 (class 2604 OID 16632)
-- Name: vente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vente ALTER COLUMN id SET DEFAULT nextval('public.vente_id_seq'::regclass);


--
-- TOC entry 4973 (class 2604 OID 16463)
-- Name: ville id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ville ALTER COLUMN id SET DEFAULT nextval('public.ville_id_seq'::regclass);


--
-- TOC entry 5297 (class 0 OID 16566)
-- Dependencies: 240
-- Data for Name: biens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.biens (id, user_id, type_bien_id, ref, statut, description, nbr_pieces, prix_apt, nbr_etage, nbr_chambres, annee_construction, nbr_lots_copropriete, image, longitude, latitude, pays, balcon, jardin, parking, garage, terrasse, piscine, equipee, ascenseur, gardien, surface, date_ajout, date_modif, quartier_id) VALUES (2, 1, 2, 'MAI-SID-001', 'LOUE', 'Maison basse familiale située à Yopougon Sideci', 5, 400000.00, 1, 4, 2010, NULL, NULL, -4.08021200, 5.33678900, 'Côte d''Ivoire', false, true, true, true, false, false, false, false, false, 150.00, '2026-01-15 14:29:52.016325', '2026-01-15 14:29:52.016325', 2);
INSERT INTO public.biens (id, user_id, type_bien_id, ref, statut, description, nbr_pieces, prix_apt, nbr_etage, nbr_chambres, annee_construction, nbr_lots_copropriete, image, longitude, latitude, pays, balcon, jardin, parking, garage, terrasse, piscine, equipee, ascenseur, gardien, surface, date_ajout, date_modif, quartier_id) VALUES (1, 3, 1, 'APT-ANG-001', 'DISPONIBLE', 'Appartement moderne situé à Angré, proche des commodités', 3, 250000.00, 4, 2, 2015, 10, NULL, -3.98760700, 5.37812100, 'Côte d''Ivoire', true, false, true, false, true, false, true, true, true, 85.50, '2026-01-15 14:29:52.016325', '2026-01-15 14:29:52.016325', 1);
INSERT INTO public.biens (id, user_id, type_bien_id, ref, statut, description, nbr_pieces, prix_apt, nbr_etage, nbr_chambres, annee_construction, nbr_lots_copropriete, image, longitude, latitude, pays, balcon, jardin, parking, garage, terrasse, piscine, equipee, ascenseur, gardien, surface, date_ajout, date_modif, quartier_id) VALUES (3, 5, 1, 'APT-ABJ-001', 'LOUE', 'Appartement 2 pièces Cocody', 2, 250000.00, NULL, 1, 2015, NULL, NULL, NULL, NULL, NULL, true, false, true, false, false, false, false, true, false, 60.00, '2026-01-19 15:01:05.958821', '2026-01-19 15:01:05.958821', 1);
INSERT INTO public.biens (id, user_id, type_bien_id, ref, statut, description, nbr_pieces, prix_apt, nbr_etage, nbr_chambres, annee_construction, nbr_lots_copropriete, image, longitude, latitude, pays, balcon, jardin, parking, garage, terrasse, piscine, equipee, ascenseur, gardien, surface, date_ajout, date_modif, quartier_id) VALUES (4, 5, 1, 'APT-ABJ-002', 'LOUE', 'Appartement 3 pièces Cocody', 3, 300000.00, NULL, 2, 2018, NULL, NULL, NULL, NULL, NULL, true, false, true, false, false, false, false, true, false, 75.00, '2026-01-19 15:01:05.958821', '2026-01-19 15:01:05.958821', 1);
INSERT INTO public.biens (id, user_id, type_bien_id, ref, statut, description, nbr_pieces, prix_apt, nbr_etage, nbr_chambres, annee_construction, nbr_lots_copropriete, image, longitude, latitude, pays, balcon, jardin, parking, garage, terrasse, piscine, equipee, ascenseur, gardien, surface, date_ajout, date_modif, quartier_id) VALUES (5, 6, 1, 'APT-ABJ-003', 'LIBRE', 'Appartement 2 pièces Marcory', 2, 200000.00, NULL, 1, 2016, NULL, NULL, NULL, NULL, NULL, false, false, true, false, false, false, false, false, false, 55.00, '2026-01-19 15:01:05.958821', '2026-01-19 15:01:05.958821', 1);
INSERT INTO public.biens (id, user_id, type_bien_id, ref, statut, description, nbr_pieces, prix_apt, nbr_etage, nbr_chambres, annee_construction, nbr_lots_copropriete, image, longitude, latitude, pays, balcon, jardin, parking, garage, terrasse, piscine, equipee, ascenseur, gardien, surface, date_ajout, date_modif, quartier_id) VALUES (6, 6, 1, 'APT-ABJ-004', 'LOUE', 'Appartement 3 pièces Marcory', 3, 280000.00, NULL, 2, 2020, NULL, NULL, NULL, NULL, NULL, true, false, true, false, false, false, false, true, false, 70.00, '2026-01-19 15:01:05.958821', '2026-01-19 15:01:05.958821', 1);


--
-- TOC entry 5287 (class 0 OID 16479)
-- Dependencies: 230
-- Data for Name: commune; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.commune (id, ville_id, nom, description, date_creation, date_modif) VALUES (1, 1, 'Cocody', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');
INSERT INTO public.commune (id, ville_id, nom, description, date_creation, date_modif) VALUES (2, 1, 'Yopougon', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');


--
-- TOC entry 5283 (class 0 OID 16441)
-- Dependencies: 226
-- Data for Name: departement; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.departement (id, region_id, nom, departement_capital, description, date_creation, date_modif) VALUES (1, 1, 'Abidjan', 'Abidjan', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');
INSERT INTO public.departement (id, region_id, nom, departement_capital, description, date_creation, date_modif) VALUES (2, 2, 'Yamoussoukro', 'Yamoussoukro', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');


--
-- TOC entry 5279 (class 0 OID 16403)
-- Dependencies: 222
-- Data for Name: district; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.district (id, pays_id, nom, district_capital, description, date_creation, date_modif) VALUES (1, 1, 'District d''Abidjan', 'Abidjan', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');
INSERT INTO public.district (id, pays_id, nom, district_capital, description, date_creation, date_modif) VALUES (2, 1, 'District de Yamoussoukro', 'Yamoussoukro', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');


--
-- TOC entry 5307 (class 0 OID 16691)
-- Dependencies: 250
-- Data for Name: expulsion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5315 (class 0 OID 16764)
-- Dependencies: 258
-- Data for Name: fiche_maintenance; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fiche_maintenance (id, tache_id, categorie, urgence, description, statut, date_demande, date_resolution, prestataire_id, date_creation, date_modif) VALUES (1, 1, 'PLOMBERIE', 'MOYENNE', 'Réparation fuite évier', 'RESOLUE', '2024-11-20', NULL, NULL, '2026-01-19 15:06:56.975268', '2026-01-19 15:06:56.975268');
INSERT INTO public.fiche_maintenance (id, tache_id, categorie, urgence, description, statut, date_demande, date_resolution, prestataire_id, date_creation, date_modif) VALUES (2, 2, 'ELECTRICITE', 'FAIBLE', 'Remplacement prise murale', 'EN_COURS', '2024-11-25', NULL, NULL, '2026-01-19 15:06:56.975268', '2026-01-19 15:06:56.975268');


--
-- TOC entry 5319 (class 0 OID 16814)
-- Dependencies: 262
-- Data for Name: gestionnaire_proprietaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.gestionnaire_proprietaire (id, gestionnaire_id, proprietaire_id, date_debut, date_fin, statut, date_creation, date_modif) VALUES (1, 4, 3, '2024-01-01', NULL, 'ACTIF', '2026-01-18 01:51:09.836053', '2026-01-18 01:51:09.836053');
INSERT INTO public.gestionnaire_proprietaire (id, gestionnaire_id, proprietaire_id, date_debut, date_fin, statut, date_creation, date_modif) VALUES (2, 4, 5, '2024-01-01', NULL, 'ACTIF', '2026-01-19 14:59:44.221521', '2026-01-19 14:59:44.221521');
INSERT INTO public.gestionnaire_proprietaire (id, gestionnaire_id, proprietaire_id, date_debut, date_fin, statut, date_creation, date_modif) VALUES (3, 4, 6, '2024-01-01', NULL, 'ACTIF', '2026-01-19 14:59:44.221521', '2026-01-19 14:59:44.221521');


--
-- TOC entry 5317 (class 0 OID 16787)
-- Dependencies: 260
-- Data for Name: historique_prix; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5299 (class 0 OID 16606)
-- Dependencies: 242
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.location (id, bien_id, lat_2_mois, contrat, statut, user_id, garant, caution, date_creation, date_modif) VALUES (1, 2, NULL, NULL, 'ACTIVE', 3, 'Oncle familial', 800000.00, '2026-01-15 14:42:01.262114', '2026-01-15 14:42:01.262114');
INSERT INTO public.location (id, bien_id, lat_2_mois, contrat, statut, user_id, garant, caution, date_creation, date_modif) VALUES (2, 1, NULL, NULL, 'TERMINEE', 3, 'Employeur', 500000.00, '2026-01-15 14:42:01.262114', '2026-01-15 14:42:01.262114');
INSERT INTO public.location (id, bien_id, lat_2_mois, contrat, statut, user_id, garant, caution, date_creation, date_modif) VALUES (3, 3, 250000.0000000000, NULL, 'ACTIVE', 7, 'YAO Paul', 500000.00, '2026-01-19 15:05:36.610215', '2026-01-19 15:05:36.610215');
INSERT INTO public.location (id, bien_id, lat_2_mois, contrat, statut, user_id, garant, caution, date_creation, date_modif) VALUES (4, 4, 300000.0000000000, NULL, 'ACTIVE', 8, 'KONE Fatou', 600000.00, '2026-01-19 15:05:36.610215', '2026-01-19 15:05:36.610215');
INSERT INTO public.location (id, bien_id, lat_2_mois, contrat, statut, user_id, garant, caution, date_creation, date_modif) VALUES (5, 5, 280000.0000000000, NULL, 'ACTIVE', 9, 'BAMBA Souleymane', 560000.00, '2026-01-19 15:05:36.610215', '2026-01-19 15:05:36.610215');


--
-- TOC entry 5305 (class 0 OID 16670)
-- Dependencies: 248
-- Data for Name: mise_en_demeure; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5309 (class 0 OID 16714)
-- Dependencies: 252
-- Data for Name: paiements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.paiements (id, location_id, montant, date_echeance, date_paiement, mode_paiement, ref_trans, motif, date_creation, date_modif) VALUES (1, 1, 250000.00, '2024-12-05', '2024-12-04', 'MOBILE_MONEY', 'PMT001', 'Loyer Décembre', '2026-01-19 15:06:09.841179', '2026-01-19 15:06:09.841179');
INSERT INTO public.paiements (id, location_id, montant, date_echeance, date_paiement, mode_paiement, ref_trans, motif, date_creation, date_modif) VALUES (2, 2, 300000.00, '2024-12-05', '2024-12-15', 'VIREMENT', 'PMT002', 'Loyer Décembre (retard)', '2026-01-19 15:06:09.841179', '2026-01-19 15:06:09.841179');
INSERT INTO public.paiements (id, location_id, montant, date_echeance, date_paiement, mode_paiement, ref_trans, motif, date_creation, date_modif) VALUES (3, 3, 280000.00, '2024-12-05', NULL, 'ESPECES', NULL, 'Loyer Décembre impayé', '2026-01-19 15:06:09.841179', '2026-01-19 15:06:09.841179');


--
-- TOC entry 5277 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: pays; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pays (id, nom, localisation, description, date_creation, date_modif) VALUES (1, 'Côte d''Ivoire', 'Afrique de l’Ouest', 'Pays d’Afrique de l’Ouest', '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');
INSERT INTO public.pays (id, nom, localisation, description, date_creation, date_modif) VALUES (2, 'Ghana', 'Afrique de l’Ouest', 'Pays voisin', '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');


--
-- TOC entry 5313 (class 0 OID 16751)
-- Dependencies: 256
-- Data for Name: prestataire; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5289 (class 0 OID 16498)
-- Dependencies: 232
-- Data for Name: quartier; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.quartier (id, commune_id, nom, description, date_creation, date_modif) VALUES (1, 1, 'Angré', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');
INSERT INTO public.quartier (id, commune_id, nom, description, date_creation, date_modif) VALUES (2, 2, 'Rosier', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');


--
-- TOC entry 5281 (class 0 OID 16422)
-- Dependencies: 224
-- Data for Name: region; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.region (id, district_id, nom, region_capital, description, date_creation, date_modif) VALUES (1, 1, 'Lagunes', 'Abidjan', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');
INSERT INTO public.region (id, district_id, nom, region_capital, description, date_creation, date_modif) VALUES (2, 2, 'Lacs', 'Yamoussoukro', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');


--
-- TOC entry 5303 (class 0 OID 16654)
-- Dependencies: 246
-- Data for Name: relance; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.relance (id, location_id, date_relance, type_relance, montant_du, statut, moyen_envoi, date_creation, date_modif) VALUES (1, 2, '2024-12-10', 'RETARD', 300000.00, 'ENVOYEE', 'SMS', '2026-01-19 15:06:27.273377', '2026-01-19 15:06:27.273377');
INSERT INTO public.relance (id, location_id, date_relance, type_relance, montant_du, statut, moyen_envoi, date_creation, date_modif) VALUES (2, 3, '2024-12-12', 'IMPAYE', 280000.00, 'ENVOYEE', 'EMAIL', '2026-01-19 15:06:27.273377', '2026-01-19 15:06:27.273377');


--
-- TOC entry 5293 (class 0 OID 16528)
-- Dependencies: 236
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.role (id, libelle, description) VALUES (1, 'ADMIN', 'Administrateur du système');
INSERT INTO public.role (id, libelle, description) VALUES (2, 'PROPRIETAIRE', 'Propriétaire de biens immobiliers');
INSERT INTO public.role (id, libelle, description) VALUES (3, 'GESTIONNAIRE', 'Gestionnaire de biens immobiliers');
INSERT INTO public.role (id, libelle, description) VALUES (4, 'LOCATAIRE', 'Locataire');
INSERT INTO public.role (id, libelle, description) VALUES (5, 'USER', 'Utilisateur standard');


--
-- TOC entry 5311 (class 0 OID 16733)
-- Dependencies: 254
-- Data for Name: taches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.taches (id, location_id, type, date_demande, date_resolution, motif, date_creation, date_modif) VALUES (1, 1, 'PLOMBERIE', '2024-11-20', NULL, 'Fuite évier cuisine', '2026-01-19 15:06:46.142758', '2026-01-19 15:06:46.142758');
INSERT INTO public.taches (id, location_id, type, date_demande, date_resolution, motif, date_creation, date_modif) VALUES (2, 2, 'ELECTRICITE', '2024-11-25', NULL, 'Prise défectueuse', '2026-01-19 15:06:46.142758', '2026-01-19 15:06:46.142758');


--
-- TOC entry 5291 (class 0 OID 16517)
-- Dependencies: 234
-- Data for Name: type_bien; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.type_bien (id, libelle) VALUES (1, 'Appartement');
INSERT INTO public.type_bien (id, libelle) VALUES (2, 'Maison');


--
-- TOC entry 5295 (class 0 OID 16541)
-- Dependencies: 238
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, nom, email, tel, pswd, adresse, photo, statut, role_id, date_ajout, dob, date_modif, blocked, expired, nbr_essais) VALUES (2, 'Marie Traoré', 'gestionnaire@immo.ci', '0700000002', '$2a$10$HASH_GESTIONNAIRE', 'Plateau, Abidjan', NULL, 'ACTIF', 3, '2026-01-14 16:32:18.894171', '1985-09-22', '2026-01-14 16:32:18.894171', false, false, 0);
INSERT INTO public.users (id, nom, email, tel, pswd, adresse, photo, statut, role_id, date_ajout, dob, date_modif, blocked, expired, nbr_essais) VALUES (3, 'Paul Yao', 'locataire@immo.ci', '0700000003', '$2a$10$HASH_LOCATAIRE', 'Yopougon Sideci, Abidjan', NULL, 'ACTIF', 4, '2026-01-14 16:32:18.894171', '1994-02-03', '2026-01-14 16:32:18.894171', false, false, 0);
INSERT INTO public.users (id, nom, email, tel, pswd, adresse, photo, statut, role_id, date_ajout, dob, date_modif, blocked, expired, nbr_essais) VALUES (1, 'Jean Kouassi', 'proprietaire@immo.ci', '0700000001', '$2a$10$HASH_PROPRIETAIRE', 'Cocody Angré, Abidjan', NULL, 'ACTIF', 2, '2026-01-14 16:32:18.894171', '1978-05-12', '2026-01-14 16:32:18.894171', false, false, 1);
INSERT INTO public.users (id, nom, email, tel, pswd, adresse, photo, statut, role_id, date_ajout, dob, date_modif, blocked, expired, nbr_essais) VALUES (4, 'Manouan Jean-Yves', 'manouanyveston@gmail.com', '+225 07 00 00 00 02', '$2a$10$mKZ/zEmgPhmWbbAGzG2ELuuJhHGE5CZXxfdFo8HFV9XQDeJd0ZJIm', 'Abidjan, Cocody', NULL, 'ACTIF', 3, '2026-01-15 20:15:32.197445', '2003-04-06', '2026-01-15 20:15:32.286709', false, false, 0);
INSERT INTO public.users (id, nom, email, tel, pswd, adresse, photo, statut, role_id, date_ajout, dob, date_modif, blocked, expired, nbr_essais) VALUES (5, 'KOUASSI Jean', 'proprio1@immogestion.ci', '0700000002', '$2a$10$hashedpwd', 'Abidjan Plateau', NULL, 'ACTIF', 2, '2026-01-19 14:57:34.084653', '1978-03-12', '2026-01-19 14:57:34.084653', false, false, 0);
INSERT INTO public.users (id, nom, email, tel, pswd, adresse, photo, statut, role_id, date_ajout, dob, date_modif, blocked, expired, nbr_essais) VALUES (6, 'TRAORE Awa', 'proprio2@immogestion.ci', '0700000003', '$2a$10$hashedpwd', 'Abidjan Marcory', NULL, 'ACTIF', 2, '2026-01-19 14:57:34.084653', '1982-11-08', '2026-01-19 14:57:34.084653', false, false, 0);
INSERT INTO public.users (id, nom, email, tel, pswd, adresse, photo, statut, role_id, date_ajout, dob, date_modif, blocked, expired, nbr_essais) VALUES (7, 'YAO Serge', 'locataire1@immogestion.ci', '0700000004', '$2a$10$hashedpwd', 'Abidjan Cocody', NULL, 'ACTIF', 4, '2026-01-19 14:57:34.084653', '1995-01-20', '2026-01-19 14:57:34.084653', false, false, 0);
INSERT INTO public.users (id, nom, email, tel, pswd, adresse, photo, statut, role_id, date_ajout, dob, date_modif, blocked, expired, nbr_essais) VALUES (8, 'KONE Mariam', 'locataire2@immogestion.ci', '0700000005', '$2a$10$hashedpwd', 'Abidjan Yopougon', NULL, 'ACTIF', 4, '2026-01-19 14:57:34.084653', '1992-07-15', '2026-01-19 14:57:34.084653', false, false, 0);
INSERT INTO public.users (id, nom, email, tel, pswd, adresse, photo, statut, role_id, date_ajout, dob, date_modif, blocked, expired, nbr_essais) VALUES (9, 'BAMBA Idrissa', 'locataire3@immogestion.ci', '0700000006', '$2a$10$hashedpwd', 'Abidjan Abobo', NULL, 'ACTIF', 4, '2026-01-19 14:57:34.084653', '1990-09-02', '2026-01-19 14:57:34.084653', false, false, 0);


--
-- TOC entry 5301 (class 0 OID 16629)
-- Dependencies: 244
-- Data for Name: vente; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5285 (class 0 OID 16460)
-- Dependencies: 228
-- Data for Name: ville; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ville (id, departement_id, nom, description, date_creation, date_modif) VALUES (1, 1, 'Abidjan', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');
INSERT INTO public.ville (id, departement_id, nom, description, date_creation, date_modif) VALUES (2, 2, 'Yamoussoukro', NULL, '2026-01-14 16:30:12.484634', '2026-01-14 16:30:12.484634');


--
-- TOC entry 5348 (class 0 OID 0)
-- Dependencies: 239
-- Name: biens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.biens_id_seq', 6, true);


--
-- TOC entry 5349 (class 0 OID 0)
-- Dependencies: 229
-- Name: commune_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commune_id_seq', 2, true);


--
-- TOC entry 5350 (class 0 OID 0)
-- Dependencies: 225
-- Name: departement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departement_id_seq', 2, true);


--
-- TOC entry 5351 (class 0 OID 0)
-- Dependencies: 221
-- Name: district_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.district_id_seq', 2, true);


--
-- TOC entry 5352 (class 0 OID 0)
-- Dependencies: 249
-- Name: expulsion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expulsion_id_seq', 1, false);


--
-- TOC entry 5353 (class 0 OID 0)
-- Dependencies: 257
-- Name: fiche_maintenance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fiche_maintenance_id_seq', 2, true);


--
-- TOC entry 5354 (class 0 OID 0)
-- Dependencies: 261
-- Name: gestionnaire_proprietaire_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gestionnaire_proprietaire_id_seq', 3, true);


--
-- TOC entry 5355 (class 0 OID 0)
-- Dependencies: 259
-- Name: historique_prix_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historique_prix_id_seq', 1, false);


--
-- TOC entry 5356 (class 0 OID 0)
-- Dependencies: 241
-- Name: location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.location_id_seq', 5, true);


--
-- TOC entry 5357 (class 0 OID 0)
-- Dependencies: 247
-- Name: mise_en_demeure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mise_en_demeure_id_seq', 1, false);


--
-- TOC entry 5358 (class 0 OID 0)
-- Dependencies: 251
-- Name: paiements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paiements_id_seq', 3, true);


--
-- TOC entry 5359 (class 0 OID 0)
-- Dependencies: 219
-- Name: pays_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pays_id_seq', 2, true);


--
-- TOC entry 5360 (class 0 OID 0)
-- Dependencies: 255
-- Name: prestataire_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prestataire_id_seq', 1, false);


--
-- TOC entry 5361 (class 0 OID 0)
-- Dependencies: 231
-- Name: quartier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quartier_id_seq', 2, true);


--
-- TOC entry 5362 (class 0 OID 0)
-- Dependencies: 223
-- Name: region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.region_id_seq', 2, true);


--
-- TOC entry 5363 (class 0 OID 0)
-- Dependencies: 245
-- Name: relance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.relance_id_seq', 2, true);


--
-- TOC entry 5364 (class 0 OID 0)
-- Dependencies: 235
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 5, true);


--
-- TOC entry 5365 (class 0 OID 0)
-- Dependencies: 253
-- Name: taches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taches_id_seq', 2, true);


--
-- TOC entry 5366 (class 0 OID 0)
-- Dependencies: 233
-- Name: type_bien_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_bien_id_seq', 2, true);


--
-- TOC entry 5367 (class 0 OID 0)
-- Dependencies: 237
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- TOC entry 5368 (class 0 OID 0)
-- Dependencies: 243
-- Name: vente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vente_id_seq', 1, false);


--
-- TOC entry 5369 (class 0 OID 0)
-- Dependencies: 227
-- Name: ville_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ville_id_seq', 2, true);


--
-- TOC entry 5066 (class 2606 OID 16587)
-- Name: biens biens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biens
    ADD CONSTRAINT biens_pkey PRIMARY KEY (id);


--
-- TOC entry 5068 (class 2606 OID 16589)
-- Name: biens biens_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biens
    ADD CONSTRAINT biens_ref_key UNIQUE (ref);


--
-- TOC entry 5048 (class 2606 OID 16491)
-- Name: commune commune_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commune
    ADD CONSTRAINT commune_pkey PRIMARY KEY (id);


--
-- TOC entry 5044 (class 2606 OID 16453)
-- Name: departement departement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departement
    ADD CONSTRAINT departement_pkey PRIMARY KEY (id);


--
-- TOC entry 5040 (class 2606 OID 16415)
-- Name: district district_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district
    ADD CONSTRAINT district_pkey PRIMARY KEY (id);


--
-- TOC entry 5085 (class 2606 OID 16702)
-- Name: expulsion expulsion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expulsion
    ADD CONSTRAINT expulsion_pkey PRIMARY KEY (id);


--
-- TOC entry 5094 (class 2606 OID 16775)
-- Name: fiche_maintenance fiche_maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_maintenance
    ADD CONSTRAINT fiche_maintenance_pkey PRIMARY KEY (id);


--
-- TOC entry 5098 (class 2606 OID 16826)
-- Name: gestionnaire_proprietaire gestionnaire_proprietaire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gestionnaire_proprietaire
    ADD CONSTRAINT gestionnaire_proprietaire_pkey PRIMARY KEY (id);


--
-- TOC entry 5096 (class 2606 OID 16796)
-- Name: historique_prix historique_prix_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_prix
    ADD CONSTRAINT historique_prix_pkey PRIMARY KEY (id);


--
-- TOC entry 5075 (class 2606 OID 16617)
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- TOC entry 5083 (class 2606 OID 16679)
-- Name: mise_en_demeure mise_en_demeure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mise_en_demeure
    ADD CONSTRAINT mise_en_demeure_pkey PRIMARY KEY (id);


--
-- TOC entry 5088 (class 2606 OID 16726)
-- Name: paiements paiements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements
    ADD CONSTRAINT paiements_pkey PRIMARY KEY (id);


--
-- TOC entry 5038 (class 2606 OID 16401)
-- Name: pays pays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pays
    ADD CONSTRAINT pays_pkey PRIMARY KEY (id);


--
-- TOC entry 5092 (class 2606 OID 16762)
-- Name: prestataire prestataire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestataire
    ADD CONSTRAINT prestataire_pkey PRIMARY KEY (id);


--
-- TOC entry 5050 (class 2606 OID 16510)
-- Name: quartier quartier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quartier
    ADD CONSTRAINT quartier_pkey PRIMARY KEY (id);


--
-- TOC entry 5042 (class 2606 OID 16434)
-- Name: region region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_pkey PRIMARY KEY (id);


--
-- TOC entry 5081 (class 2606 OID 16663)
-- Name: relance relance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relance
    ADD CONSTRAINT relance_pkey PRIMARY KEY (id);


--
-- TOC entry 5056 (class 2606 OID 16539)
-- Name: role role_libelle_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_libelle_key UNIQUE (libelle);


--
-- TOC entry 5058 (class 2606 OID 16537)
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- TOC entry 5090 (class 2606 OID 16744)
-- Name: taches taches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches
    ADD CONSTRAINT taches_pkey PRIMARY KEY (id);


--
-- TOC entry 5052 (class 2606 OID 16526)
-- Name: type_bien type_bien_libelle_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_bien
    ADD CONSTRAINT type_bien_libelle_key UNIQUE (libelle);


--
-- TOC entry 5054 (class 2606 OID 16524)
-- Name: type_bien type_bien_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_bien
    ADD CONSTRAINT type_bien_pkey PRIMARY KEY (id);


--
-- TOC entry 5100 (class 2606 OID 16828)
-- Name: gestionnaire_proprietaire uq_gestionnaire_proprietaire; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gestionnaire_proprietaire
    ADD CONSTRAINT uq_gestionnaire_proprietaire UNIQUE (gestionnaire_id, proprietaire_id);


--
-- TOC entry 5102 (class 2606 OID 16840)
-- Name: gestionnaire_proprietaire uq_proprietaire; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gestionnaire_proprietaire
    ADD CONSTRAINT uq_proprietaire UNIQUE (proprietaire_id);


--
-- TOC entry 5062 (class 2606 OID 16559)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5064 (class 2606 OID 16557)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5079 (class 2606 OID 16642)
-- Name: vente vente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vente
    ADD CONSTRAINT vente_pkey PRIMARY KEY (id);


--
-- TOC entry 5046 (class 2606 OID 16472)
-- Name: ville ville_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ville
    ADD CONSTRAINT ville_pkey PRIMARY KEY (id);


--
-- TOC entry 5069 (class 1259 OID 16804)
-- Name: idx_biens_quartier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_biens_quartier ON public.biens USING btree (quartier_id);


--
-- TOC entry 5070 (class 1259 OID 16803)
-- Name: idx_biens_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_biens_type ON public.biens USING btree (type_bien_id);


--
-- TOC entry 5071 (class 1259 OID 16802)
-- Name: idx_biens_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_biens_user ON public.biens USING btree (user_id);


--
-- TOC entry 5072 (class 1259 OID 16805)
-- Name: idx_location_bien; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_location_bien ON public.location USING btree (bien_id);


--
-- TOC entry 5073 (class 1259 OID 16806)
-- Name: idx_location_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_location_user ON public.location USING btree (user_id);


--
-- TOC entry 5086 (class 1259 OID 16809)
-- Name: idx_paiements_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_paiements_location ON public.paiements USING btree (location_id);


--
-- TOC entry 5059 (class 1259 OID 16810)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 5060 (class 1259 OID 16811)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role_id);


--
-- TOC entry 5076 (class 1259 OID 16808)
-- Name: idx_vente_bien; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vente_bien ON public.vente USING btree (bien_id);


--
-- TOC entry 5077 (class 1259 OID 16807)
-- Name: idx_vente_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vente_user ON public.vente USING btree (user_id);


--
-- TOC entry 5110 (class 2606 OID 16600)
-- Name: biens biens_quartier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biens
    ADD CONSTRAINT biens_quartier_id_fkey FOREIGN KEY (quartier_id) REFERENCES public.quartier(id);


--
-- TOC entry 5111 (class 2606 OID 16595)
-- Name: biens biens_type_bien_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biens
    ADD CONSTRAINT biens_type_bien_id_fkey FOREIGN KEY (type_bien_id) REFERENCES public.type_bien(id);


--
-- TOC entry 5112 (class 2606 OID 16590)
-- Name: biens biens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biens
    ADD CONSTRAINT biens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5107 (class 2606 OID 16492)
-- Name: commune commune_ville_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commune
    ADD CONSTRAINT commune_ville_id_fkey FOREIGN KEY (ville_id) REFERENCES public.ville(id);


--
-- TOC entry 5105 (class 2606 OID 16454)
-- Name: departement departement_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departement
    ADD CONSTRAINT departement_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.region(id);


--
-- TOC entry 5103 (class 2606 OID 16416)
-- Name: district district_pays_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district
    ADD CONSTRAINT district_pays_id_fkey FOREIGN KEY (pays_id) REFERENCES public.pays(id);


--
-- TOC entry 5120 (class 2606 OID 16703)
-- Name: expulsion expulsion_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expulsion
    ADD CONSTRAINT expulsion_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- TOC entry 5121 (class 2606 OID 16708)
-- Name: expulsion expulsion_mise_en_demeure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expulsion
    ADD CONSTRAINT expulsion_mise_en_demeure_id_fkey FOREIGN KEY (mise_en_demeure_id) REFERENCES public.mise_en_demeure(id);


--
-- TOC entry 5124 (class 2606 OID 16781)
-- Name: fiche_maintenance fiche_maintenance_prestataire_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_maintenance
    ADD CONSTRAINT fiche_maintenance_prestataire_id_fkey FOREIGN KEY (prestataire_id) REFERENCES public.prestataire(id);


--
-- TOC entry 5125 (class 2606 OID 16776)
-- Name: fiche_maintenance fiche_maintenance_tache_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_maintenance
    ADD CONSTRAINT fiche_maintenance_tache_id_fkey FOREIGN KEY (tache_id) REFERENCES public.taches(id);


--
-- TOC entry 5127 (class 2606 OID 16829)
-- Name: gestionnaire_proprietaire fk_gp_gestionnaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gestionnaire_proprietaire
    ADD CONSTRAINT fk_gp_gestionnaire FOREIGN KEY (gestionnaire_id) REFERENCES public.users(id);


--
-- TOC entry 5128 (class 2606 OID 16834)
-- Name: gestionnaire_proprietaire fk_gp_proprietaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gestionnaire_proprietaire
    ADD CONSTRAINT fk_gp_proprietaire FOREIGN KEY (proprietaire_id) REFERENCES public.users(id);


--
-- TOC entry 5126 (class 2606 OID 16797)
-- Name: historique_prix historique_prix_bien_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_prix
    ADD CONSTRAINT historique_prix_bien_id_fkey FOREIGN KEY (bien_id) REFERENCES public.biens(id);


--
-- TOC entry 5113 (class 2606 OID 16618)
-- Name: location location_bien_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_bien_id_fkey FOREIGN KEY (bien_id) REFERENCES public.biens(id);


--
-- TOC entry 5114 (class 2606 OID 16623)
-- Name: location location_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5118 (class 2606 OID 16680)
-- Name: mise_en_demeure mise_en_demeure_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mise_en_demeure
    ADD CONSTRAINT mise_en_demeure_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- TOC entry 5119 (class 2606 OID 16685)
-- Name: mise_en_demeure mise_en_demeure_relance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mise_en_demeure
    ADD CONSTRAINT mise_en_demeure_relance_id_fkey FOREIGN KEY (relance_id) REFERENCES public.relance(id);


--
-- TOC entry 5122 (class 2606 OID 16727)
-- Name: paiements paiements_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements
    ADD CONSTRAINT paiements_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- TOC entry 5108 (class 2606 OID 16511)
-- Name: quartier quartier_commune_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quartier
    ADD CONSTRAINT quartier_commune_id_fkey FOREIGN KEY (commune_id) REFERENCES public.commune(id);


--
-- TOC entry 5104 (class 2606 OID 16435)
-- Name: region region_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.district(id);


--
-- TOC entry 5117 (class 2606 OID 16664)
-- Name: relance relance_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relance
    ADD CONSTRAINT relance_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- TOC entry 5123 (class 2606 OID 16745)
-- Name: taches taches_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taches
    ADD CONSTRAINT taches_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- TOC entry 5109 (class 2606 OID 16560)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- TOC entry 5115 (class 2606 OID 16648)
-- Name: vente vente_bien_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vente
    ADD CONSTRAINT vente_bien_id_fkey FOREIGN KEY (bien_id) REFERENCES public.biens(id);


--
-- TOC entry 5116 (class 2606 OID 16643)
-- Name: vente vente_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vente
    ADD CONSTRAINT vente_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5106 (class 2606 OID 16473)
-- Name: ville ville_departement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ville
    ADD CONSTRAINT ville_departement_id_fkey FOREIGN KEY (departement_id) REFERENCES public.departement(id);


-- Completed on 2026-01-19 18:54:07

--
-- PostgreSQL database dump complete
--

\unrestrict 14mpWGMEKgcI0mIYjTAglrg7NVb5gJ0ohOdNRHo2qrHS2XNIYilqyLBYa2cZfIK

