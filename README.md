# Online Banking Platform - Evo Bank

# Technologies
Node JS, React, Docker, PostgreSQL.

# Security Functionalities
Authorization based on roles (User, Admin, Support). \
Authentication based on auth tokens. \
Account activation via link activation sent by email.

# Functionalities
[User]
- view current balance and number of transactions / day graph in dashboard. \
- view transactions history. \
- view authorized forum posts (authorized by forum moderator). \
- send money to a friend. \
- deposit money. \
- account settings. \

[Support]
- view all forum posts, can answer to users' questions and problems, bookmark important topics. \
- visualize number of posts / day graph. \

[Admin]
- visualize relevant graphs related to users' activity on platform, such as logins per day, registers per day or transactions per day. \
- can edit users' roles and delete users' accounts

# How To Run The App
Go to /backend/Docker and run [docker-compose up] command. \
Go to /backend and run [npm run start-dev]. \
Go to /frontend and run [npm start].
