CREATE DATABASE dialogo;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE avatar_type AS ENUM (
	'avatar_1',
	'avatar_2',
	'avatar_3',
	'avatar_4',
	'avatar_5',
	'avatar_6',
	'avatar_7',
	'avatar_8',
	'avatar_9'
);


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatar avatar_type NOT NULL DEFAULT 'avatar_1',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    password TEXT,
    description TEXT,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE users_chats (
    user_id UUID NOT NULL,
    chat_id UUID NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, chat_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);


CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
