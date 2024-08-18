-- Drop existing tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS attributes CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS llm_configs CASCADE;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

-- Create subcategories table
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- Create attributes table
CREATE TABLE attributes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL
);

-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  subcategory VARCHAR(255) NOT NULL,
  attributes JSONB,
  human_attributes JSONB,
  human_verified BOOLEAN DEFAULT FALSE
);

-- Create prompts table
CREATE TABLE prompts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  step INTEGER NOT NULL
);

-- Create llm_configs table
CREATE TABLE llm_configs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) NOT NULL,
  max_tokens INTEGER NOT NULL
);

-- Insert admin user
INSERT INTO users (username, password, role) 
VALUES ('admin', 'password', 'admin')
ON CONFLICT (username) DO NOTHING;
