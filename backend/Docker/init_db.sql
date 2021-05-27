

CREATE TABLE IF NOT EXISTS roles (
    id serial PRIMARY KEY,
    value varchar NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    passworD VARCHAR NOT NULL,
    balance integer,
    role_id integer REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id serial PRIMARY KEY,
    id_sender integer REFERENCES users(id),
    id_receiver integer REFERENCES users(id),
    amount integer NOT NULL,
    transfer_date timestamp
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id serial PRIMARY KEY,
    id_transaction integer REFERENCES transactions(id),
    scheduled_time timestamp
);

CREATE TABLE IF NOT EXISTS forum_posts (
    id serial PRIMARY KEY,
    title varchar NOT NULL,
    description varchar NOT NULL,
    response varchar,
    visible boolean, 
    user_id integer REFERENCES users(id)
);


INSERT INTO roles (value) VALUES ('ADMIN');
INSERT INTO roles (value) VALUES ('SUPPORT');
INSERT INTO roles (value) VALUES ('USER');

INSERT INTO users (username, email, password, role_id) VALUES ('admin', 'admin@gmail.com', '$2y$10$BLMZFAnCPXX0cVRmdPP3Meu3NR/xWucAyQ4aAW2z57RlLdLPvH0Hi', 1);
INSERT INTO users (username, email, password, role_id) VALUES ('support', 'support@gmail.com', '$2y$10$BLMZFAnCPXX0cVRmdPP3Meu3NR/xWucAyQ4aAW2z57RlLdLPvH0Hi', 2);

