CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS prompts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    step INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS llm_configs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    max_tokens INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    parent_category VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS subcategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255) NOT NULL,
    FOREIGN KEY (category) REFERENCES categories(name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attributes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    values JSONB,
    category VARCHAR(255) NOT NULL,
    subcategory VARCHAR(255) NOT NULL,
    FOREIGN KEY (category) REFERENCES categories(name) ON DELETE CASCADE,
    FOREIGN KEY (subcategory) REFERENCES subcategories(name) ON DELETE CASCADE,
    UNIQUE (name, category, subcategory)
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255) NOT NULL,
    subcategory VARCHAR(255) NOT NULL,
    attributes JSONB NOT NULL,
    human_attributes JSONB,
    human_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (category) REFERENCES categories(name) ON DELETE CASCADE,
    FOREIGN KEY (subcategory) REFERENCES subcategories(name) ON DELETE CASCADE
);