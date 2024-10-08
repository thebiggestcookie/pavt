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

The database schema will be automatically set up when you first run the application. The `initializeDatabase` function in `server.js` will create all necessary tables using the `schema.sql` file.

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
4. Check if the admin user exists in the database by running this SQL command in the database shell:

   ```sql
   SELECT * FROM users WHERE username = 'admin';
   ```

   If the admin user doesn't exist, you can add it manually:

   ```sql
   INSERT INTO users (username, password, role) VALUES ('admin', 'password', 'admin');
   ```

5. If you make any changes to your code, remember to commit and push to GitHub, then manually deploy again in the Render dashboard.
6. If the issue persists, try to manually test the login API endpoint using a tool like curl or Postman. Here's an example curl command:

   ```
   curl -X POST https://your-app-url.onrender.com/api/login -H "Content-Type: application/json" -d '{"username":"admin","password":"password"}'
   ```

   Replace `https://your-app-url.onrender.com` with your actual app URL.

7. If you're still having issues, you may need to check your database connection. You can add more logging in the `server.js` file to help diagnose the problem.

Remember to secure your application properly, especially if you're handling sensitive data. Consider implementing proper authentication, using environment variables for sensitive information, and following security best practices.