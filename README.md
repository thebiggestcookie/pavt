# LLM Product Categorizer

This project is a React-based application for categorizing and managing e-commerce products using Large Language Models (LLMs).

## Deployment Instructions for Render

To deploy this application on Render, follow these steps:

1. **Create a new Web Service on Render:**
   - Log in to your Render account and click on "New +" then select "Web Service".
   - Connect your GitHub repository to Render.

2. **Configure the Web Service:**
   - Name: Choose a name for your service (e.g., "llm-product-categorizer")
   - Environment: Select "Node"
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Set up environment variables:**
   - In the Render dashboard, go to your web service's "Environment" tab.
   - Add the following environment variables:
     - `REACT_APP_API_URL`: Set this to the URL of your backend API (if applicable)

4. **Deploy the application:**
   - Click on "Manual Deploy" and select "Deploy latest commit" to start the deployment process.

5. **Access your deployed application:**
   - Once the deployment is complete, Render will provide you with a URL to access your application.

### Additional Notes:

- This setup assumes you're using Create React App or a similar setup that provides a production build with `npm run build`.
- If you have a separate backend API, you'll need to deploy that as a separate service on Render or another platform.
- Make sure your `package.json` includes a `start` script that can serve your built React application. You might need to add a simple server like `serve` to your project:
  ```
  npm install --save serve
  ```
  Then add this to your `package.json` scripts:
  ```json
  "scripts": {
    "start": "serve -s build",
    // other scripts...
  }
  ```

- If you're using client-side routing (e.g., React Router), you might need to configure Render to handle client-side routes. Add a `render.yaml` file to your project root with the following content:

  ```yaml
  routes:
    - type: rewrite
      source: /*
      destination: /index.html
  ```

- Remember to update your API calls in the frontend code to use the environment variable for the API URL:
  ```javascript
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  ```

By following these steps, your LLM Product Categorizer should be successfully deployed on Render as a web service.