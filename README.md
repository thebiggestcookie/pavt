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
     - `REACT_APP_API_URL`: Set this to the URL of your backend API. If you're deploying your backend on Render as well, it would typically be in the format `https://your-backend-service-name.onrender.com/api`. Replace `your-backend-service-name` with the actual name you gave to your backend service on Render.

4. **Deploy the application:**
   - Click on "Manual Deploy" and select "Deploy latest commit" to start the deployment process.

5. **Access your deployed application:**
   - Once the deployment is complete, Render will provide you with a URL to access your application.

### Additional Notes:

- This setup assumes you're using Create React App or a similar setup that provides a production build with `npm run build`.
- If you have a separate backend API, you'll need to deploy that as a separate service on Render or another platform. Make sure to update the `REACT_APP_API_URL` to point to your deployed backend service.
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

- If you haven't deployed your backend yet, you'll need to do that first. Create a separate Web Service on Render for your backend, deploy it, and then use its URL for the `REACT_APP_API_URL` environment variable when setting up this frontend service.

## Debugging

If you're experiencing issues with submitting information or creating new data, follow these steps to debug:

1. Open your browser's developer tools (usually F12 or right-click and select "Inspect").
2. Go to the "Console" tab in the developer tools.
3. Interact with the application as normal, trying to submit information or create new data.
4. Look for any error messages or debug logs in the console. These will provide information about what's going wrong.
5. If you see any API-related errors, check that your `REACT_APP_API_URL` is set correctly and that your backend service is running and accessible.
6. If you don't see any errors, but the data isn't being saved, check your backend logs for any server-side errors.

Remember to check both the frontend console logs and the backend server logs to get a complete picture of what's happening during your API requests.

By following these steps, your LLM Product Categorizer should be successfully deployed on Render as a web service, and you should be able to debug any issues that arise.