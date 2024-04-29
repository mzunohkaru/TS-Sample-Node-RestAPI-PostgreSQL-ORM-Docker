### データベース (PostgreSQL) へのアクセス

$ docker-compose exec db psql -U user -d dev -W

### PostgreSQL コマンド

CREATE TABLE users ( id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255) );
INSERT INTO users (name, email, password) VALUES ('Yamada', 'yamada@example.com', 'password');
