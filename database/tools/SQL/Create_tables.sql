CREATE TABLE dev_dba.users
(
	id bigserial NOT NULL,
	role TEXT DEFAULT 'user' CHECK (role IN('user', 'admin', 'moderator')),
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    liked integer[] DEFAULT '{}',
    viewed integer[] DEFAULT '{}',
	friend_list TEXT[] DEFAULT '{}',
	request_list TEXT[] DEFAULT '{}',
	is_author TEXT[] DEFAULT '{}',
	created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp with time zone,
	last_login timestamp with time zone,
	is_active boolean DEFAULT false,
	avatar TEXT,
	git_id BIGINT,
	two_factor_enabled boolean DEFAULT false,
	two_factor_secret text,
	two_factor_temp_secret text,
	two_factor_enabled_at timestamp with time zone,
	CONSTRAINT "unique_user" UNIQUE(name),
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS dev_dba.users
    OWNER to dev_dba;


CREATE TABLE dev_dba.ingredients
(
    id bigserial NOT NULL,
    name TEXT NOT NULL,
    price_per_kg numeric(7, 2) NOT NULL CHECK (price_per_kg >= 0),
	diet_type TEXT,
    last_update date DEFAULT NULL,
	unit TEXT DEFAULT 'Kg',
    PRIMARY KEY (id),
    CONSTRAINT "Unique" UNIQUE (name)
);

ALTER TABLE IF EXISTS dev_dba.ingredients
    OWNER to dev_dba;


CREATE TABLE dev_dba.all_recipes
(
	id bigserial NOT NULL,
	name TEXT NOT NULL,
	diet TEXT NOT NULL DEFAULT 'Omnivorous',
	ingredients JSONB DEFAULT '{}'::JSONB,
	instructions TEXT DEFAULT NULL,
	image TEXT,
	url TEXT DEFAULT NULL,
	cost numeric(5, 2) DEFAULT 0,
	portions integer DEFAULT 1,
	created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	updated timestamp with time zone,
	is_public boolean DEFAULT false,
	prep_time integer,
	cooking_time integer,
	liked integer DEFAULT 0,
	viewed integer DEFAULT 0,
	author TEXT,
	CONSTRAINT "recipe_unique_name" UNIQUE(name),
	PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS dev_dba.all_recipes
    OWNER to dev_dba;


CREATE TABLE dev_dba.recipe_ingredients
(
	recipe_id bigint REFERENCES dev_dba.all_recipes(id),
	ingredient_id bigint REFERENCES dev_dba.ingredients(id),
	name TEXT NOT NULL,
	quantity numeric (6,2) NOT NULL,
	unit TEXT,
	PRIMARY KEY (recipe_id, ingredient_id)

);

CREATE TABLE public.all_recipes
(
	id bigserial NOT NULL,
	name TEXT NOT NULL,
	diet TEXT NOT NULL DEFAULT 'Omnivorous',
	ingredients JSONB DEFAULT '{}'::JSONB,
	instructions TEXT DEFAULT NULL,
	image TEXT,
	url TEXT DEFAULT NULL,
	cost numeric(5, 2) DEFAULT 0,
	portions integer DEFAULT 1,
	created_at timestamp with time zone,
	updated timestamp with time zone,
	is_public boolean DEFAULT false,
	prep_time integer,
	cooking_time integer,
	liked integer DEFAULT 0,
	viewed integer DEFAULT 0,
	author TEXT,
	CONSTRAINT "public_recipe_unique_name" UNIQUE(name),
	PRIMARY KEY (id)
);


CREATE TABLE public.pending_recipes
(
	id bigserial NOT NULL,
	author TEXT,
	name TEXT NOT NULL,
	ingredients JSONB NOT NULL,
	diet TEXT NOT NULL DEFAULT 'Vegan',
	instructions TEXT DEFAULT NULL,
	url TEXT DEFAULT NULL,
	cost numeric(5, 2) DEFAULT 0,
	portions integer DEFAULT 1,
	submitted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	prep_time integer,
	cooking_time integer,
	status TEXT DEFAULT 'pending' CHECK (status IN('pending', 'approved', 'rejected')),
	PRIMARY KEY (id)
);

CREATE TABLE public.user_info
(
	id bigserial NOT NULL,
    name TEXT NOT NULL REFERENCES dev_dba.users(name),
    liked integer[] DEFAULT '{}',
    viewed integer[] DEFAULT '{}',
	last_login timestamp with time zone,
	is_active boolean DEFAULT false,
	url TEXT,
	avatar TEXT,
    PRIMARY KEY (id)
);

