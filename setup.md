# Setup Guide for LLM Product Categorizer on Render

This guide will walk you through setting up your LLM Product Categorizer application on Render, including both the web service and the database.

## 1. Database Setup

1. Log in to your Render dashboard.
2. Click on the "New +" button and select "PostgreSQL".
3. Fill in the following details:
   - Name: Choose a name for your database (e.g., "llm-product-categorizer-db")
   - Database: Leave as is (Render will generate this)
   - User: Leave as is (Render will generate this)
   - Region: Choose the region closest to your users
   - PostgreSQL Version: Choose the latest version available
   - Plan: Select the plan that fits your needs (you can start with the free plan for development)
4. Click "Create Database".

After the database is created, you'll see a "Connection" tab. Note down the "Internal Database URL" as you'll need it later.

## 2. Web Service Setup

1. In your Render dashboard, click on the "New +" button and select "Web Service".
2. Connect your GitHub repository containing the LLM Product Categorizer code.
3. Fill in the following details:
   - Name: Choose a name for your web service (e.g., "llm-product-categorizer")
   - Region: Choose the same region as your database
   - Branch: Select the branch you want to deploy
   - Root Directory: Leave blank if your code is in the root of the repository
   - Environment: Choose "Node"
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run server`
4. In the "Environment Variables" section, add the following:
   - Key: `DATABASE_URL`, Value: [Your Internal Database URL from step 1]
   - Key: `NODE_ENV`, Value: `production`
5. Click "Create Web Service".

## 3. Database Schema Setup

To set up your database schema, you'll need to use the Render database shell. Here's how:

1. In your Render dashboard, go to your PostgreSQL database.
2. Click on the "Shell" tab.
3. You'll be connected to your database. Now, copy and paste the following SQL commands to create your schema:

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

-- Insert initial admin user
INSERT INTO users (username, password, role) VALUES ('admin', 'password', 'admin');
```

4. Press Enter to execute the commands. You should see "CREATE TABLE" messages for each table created and a message confirming the insertion of the admin user.

## 4. Finalize Setup

1. Go back to your web service in the Render dashboard.
2. Click on the "Manual Deploy" button and select "Deploy latest commit".
3. Wait for the deployment to complete.

Your LLM Product Categorizer should now be set up and running on Render. You can access it via the URL provided in your web service dashboard.

## 5. Logging In

After the setup is complete, you should be able to log in with the following credentials:

- Username: admin
- Password: password

If you're unable to log in, check the server logs in the Render dashboard for any error messages.

## 6. Troubleshooting

If you encounter any issues:

1. Check the logs in your Render dashboard for both the web service and the database.
2. Ensure that the `DATABASE_URL` environment variable is correctly set in your web service settings.
3. Verify that the database schema was created successfully by connecting to the database shell and running `\dt` to list all tables.
4. If the admin user is not present, you can manually add it by connecting to the database shell and running:

   ```sql
   INSERT INTO users (username, password, role) VALUES ('admin', 'password', 'admin');
   ```

5. If you make any changes to your code, remember to commit and push to GitHub, then manually deploy again in the Render dashboard.

Remember to secure your application properly, especially if you're handling sensitive data. Consider implementing proper authentication, using environment variables for sensitive information, and following security best practices.