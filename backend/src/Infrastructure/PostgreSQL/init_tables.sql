

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
    user_id integer REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    passworD VARCHAR NOT NULL,
    balance integer SET DEFAULT 0,
    role_id REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id serial PRIMARY KEY,
    id_sender integer REFERENCES users(id),
    id_receiver integer REFERENCES users(id),
    amount integer NOT NULL,
    transfer_date timestamp
);

CREATE TABLE IF NOT EXISTS tokens (
    id serial PRIMARY KEY,
    user_id serial REFERENCES users(id),
    access_token VARCHAR NOT NULL 
);

// Get all transactions for a user_id
/GET/transaction/:user_id

select
    sender_username, receiver_username, amount, transac_date_str, transac_date
from (
 
    (select
        sender.username as sender_username, receiver.username as receiver_username,
        transac.amount, to_char(transac.transfer_date, 'dd-mm-yyyyhh24:mi:ss') as transac_transfer_date_str, transac.transfer_date as transac_transfer_date
    from
        transactions transac
        join users sender on transac.id_sender = sender.id
        join users receiver on transcac.id_receiver = receiver.id
    where
        sender.id = param$user_id)

    union all

    (select
        sender.username as sender_username, receiver.username as receiver_username,
        transac.amount, to_char(transac.transfer_date, 'dd-mm-yyyy') as transac_transfer_date_str, transac.transfer_date as transac_transfer_date
    from
        transactions transac
        join users sender on transac.id_sender = sender.id
        join users receiver on transcac.id_receiver = receiver.id
    where
 
        receiver.id = param$user_id)

)
order by
    transac_transfer_date desc;


select b.userid,
    b.first_name,
    b.last_name,
    b.email,
    t.access_token 

from bank_user b inner join tokens t on b.userid=t.userid 

where t.access_token=$1 and t.userid=$2',
      [token, decoded.userid]