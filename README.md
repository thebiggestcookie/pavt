# LLM Product Categorizer

This project is a React-based application for categorizing and managing e-commerce products using Large Language Models (LLMs).

## Database Configuration for Render

When configuring the database on Render, you need to set up a PostgreSQL database and use the provided connection string. Here's how to do it:

1. In your Render dashboard, go to the "New +" button and select "PostgreSQL".
2. Choose a name for your database and select the region closest to your users.
3. Choose a plan that fits your needs (you can start with the free plan for development).
4. Click "Create Database".

Once your database is created, you'll see a "Connection" tab with your connection details. The `Internal Database URL` is what you'll use for your `DATABASE_URL` environment variable.

## Environment Variables

In your Render dashboard, go to the Environment section of your web service and add the following variables:

- `DATABASE_URL`: Set this to the Internal Database URL provided by Render for your PostgreSQL database.
- `NODE_ENV`: Set this to "production".

## Additional Changes

1. The `server.js` file has been updated to use PostgreSQL instead of in-memory storage or JSON files.
2. The `package.json` file has been updated to include the `pg` package for PostgreSQL support.
3. Make sure to run `npm install` to install the new dependencies before deploying.

## Database Schema

You'll need to set up your database schema. Here's a basic schema for the tables used in this application:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  last_login TIMESTAMP
);

CREATE TABLE llm_configs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) NOT NULL,
  max_tokens INTEGER NOT NULL
);

CREATE TABLE prompts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE attributes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  attributes JSONB,
  human_attributes JSONB,
  human_verified BOOLEAN DEFAULT FALSE,
  needs_review BOOLEAN DEFAULT FALSE
);

CREATE TABLE token_usage (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  token_count INTEGER NOT NULL
);

CREATE TABLE grader_performance (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  accuracy FLOAT NOT NULL
);

CREATE TABLE llm_performance (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  model VARCHAR(255) NOT NULL,
  accuracy FLOAT NOT NULL
);
```

You can run these SQL commands in your Render PostgreSQL database to set up the necessary tables.

Remember to update your application's error handling and connection management to properly handle database connections and potential errors.