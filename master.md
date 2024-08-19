# LLM Product Categorizer - Master Document

## Database Schema

### Products
- id: INT (Primary Key)
- name: VARCHAR(255)
- subcategory: VARCHAR(100)
- attributes: JSON

### Prompts
- id: INT (Primary Key)
- name: VARCHAR(100)
- content: TEXT
- step: INT

### Users
- id: INT (Primary Key)
- username: VARCHAR(100)
- password: VARCHAR(255) (hashed)
- role: VARCHAR(50)

## Pages and Components

### ProductGenerator (src/components/ProductGenerator.js)
Purpose: Generate product data using LLM-based prompts.
- Fetches prompts from the backend
- Generates sample products, matches subcategories, and generates attributes
- Allows saving of generated products

Connections:
- Uses API functions from src/utils/api.js
- Uses attributes data from src/data/attributes.js

### HumanGraderV2 (src/components/HumanGraderV2.js)
Purpose: Allow human graders to review and grade generated products.
- Fetches products to grade
- Displays product details and allows attribute modification
- Submits grading results

Connections:
- Uses API functions from src/utils/api.js
- Uses dummy data from src/data/dummyProducts.js (temporary)
- Uses attributes data from src/data/attributes.js

### AttributeEditor (src/components/AttributeEditor.js)
Purpose: Edit and manage product attributes for different subcategories.
- Displays and allows editing of attributes for each subcategory
- Updates attribute data

Connections:
- Should use API functions from src/utils/api.js (to be implemented)
- Uses attributes data from src/data/attributes.js

### PromptManagement (src/components/PromptManagement.js)
Purpose: Manage prompts used in the product generation process.
- Displays existing prompts
- Allows creation, editing, and deletion of prompts

Connections:
- Should use API functions from src/utils/api.js (to be implemented)

### Login (src/components/Login.js)
Purpose: Handle user authentication.
- Provides login form
- Manages user session

Connections:
- Should use API functions from src/utils/api.js (to be implemented)

## Utility Files

### src/utils/api.js
Purpose: Centralize API calls and handle authentication.
- Provides functions for interacting with the backend API
- Handles authentication token management

Connections:
- Used by various components for API interactions

### src/utils/debug.js
Purpose: Provide debugging utilities.
- Offers functions for logging debug information

Connections:
- Used by various components for debugging

### src/data/attributes.js
Purpose: Store attribute data for different subcategories.
- Provides a structured object of attributes and their possible values

Connections:
- Used by ProductGenerator and HumanGraderV2 components

### src/data/dummyProducts.js
Purpose: Provide sample product data for testing.
- Contains an array of dummy product objects

Connections:
- Used by HumanGraderV2 component (temporary)

## Interconnection Check

1. API Integration:
   - Ensure all components are using the centralized API functions from src/utils/api.js
   - Verify that API endpoints in src/utils/api.js match the backend routes

2. Authentication:
   - Implement proper authentication flow using the Login component
   - Ensure API calls include authentication tokens where necessary

3. Data Flow:
   - Verify that generated products from ProductGenerator can be saved and later accessed by HumanGraderV2
   - Ensure attributes edited in AttributeEditor are reflected in ProductGenerator and HumanGraderV2

4. Prompt Management:
   - Implement proper integration between PromptManagement and ProductGenerator to use updated prompts

5. Error Handling:
   - Ensure consistent error handling across all components using the API

6. State Management:
   - Consider implementing a global state management solution (e.g., Redux) for better data consistency across components

7. Route Protection:
   - Implement route protection to ensure only authenticated users can access certain pages

8. Backend Alignment:
   - Ensure the frontend components align with the backend API structure and database schema

Next Steps:
1. Implement missing API integrations in components
2. Develop backend routes and controllers to match the frontend expectations
3. Implement proper authentication and authorization
4. Replace dummy data with real data from the backend
5. Conduct thorough testing of the entire flow from product generation to human grading
6. Implement proper error handling and user feedback throughout the application