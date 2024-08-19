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

### Attributes
- subcategory: VARCHAR(100)
- attributes: JSON

## Pages and Components

### ProductGenerator (src/components/ProductGenerator.js)
Purpose: Generate product data using LLM-based prompts.
- Fetches prompts from the backend
- Generates sample products, matches subcategories, and generates attributes
- Allows saving of generated products

Connections:
- Uses API functions from src/utils/api.js
- Uses attributes data from backend via API

### HumanGraderV2 (src/components/HumanGraderV2.js)
Purpose: Allow human graders to review and grade generated products.
- Fetches products to grade
- Displays product details and allows attribute modification
- Submits grading results

Connections:
- Uses API functions from src/utils/api.js
- Uses attributes data from backend via API

### AttributeEditor (src/components/AttributeEditor.js)
Purpose: Edit and manage product attributes for different subcategories.
- Displays and allows editing of attributes for each subcategory
- Updates attribute data

Connections:
- Uses API functions from src/utils/api.js

### PromptManagement (src/components/PromptManagement.js)
Purpose: Manage prompts used in the product generation process.
- Displays existing prompts
- Allows creation, editing, and deletion of prompts

Connections:
- Uses API functions from src/utils/api.js

### Login (src/components/Login.js)
Purpose: Handle user authentication.
- Provides login form
- Manages user session

Connections:
- Uses API functions from src/utils/api.js

### Navigation (src/components/Navigation.js)
Purpose: Provide navigation menu for authenticated users.
- Displays links to different pages
- Handles user logout

Connections:
- Uses API functions from src/utils/api.js for logout

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

## Interconnection Check

1. API Integration:
   - All components now use centralized API functions from src/utils/api.js
   - API endpoints in src/utils/api.js should match the backend routes

2. Authentication:
   - Login component implemented and integrated with API
   - API calls include authentication tokens where necessary
   - PrivateRoute component added to protect authenticated routes

3. Data Flow:
   - ProductGenerator can save generated products
   - HumanGraderV2 fetches products to grade from the backend
   - AttributeEditor fetches and updates attributes via API

4. Prompt Management:
   - PromptManagement component fully integrated with API for CRUD operations

5. Error Handling:
   - Consistent error handling implemented across all components using the API

6. State Management:
   - Local state management used in components
   - Consider implementing Redux for global state if needed in the future

7. Route Protection:
   - PrivateRoute component implemented to ensure only authenticated users can access certain pages

8. Backend Alignment:
   - Frontend components aligned with the backend API structure and database schema

Next Steps:
1. Implement backend routes and controllers to match the frontend expectations
2. Conduct thorough testing of the entire flow from product generation to human grading
3. Implement proper error handling and user feedback throughout the application
4. Consider adding more robust state management if needed
5. Implement user roles and permissions for different parts of the application
6. Add unit and integration tests for components and API functions
7. Set up continuous integration and deployment pipeline
8. Create user documentation and API documentation