# Updates

## Update #13
- Added new API utility file (src/utils/api.js)
  - Implemented centralized API configuration with axios
  - Added interceptor for authentication token
  - Created separate functions for each API call
  - Status: Implemented, needs testing
  - Technical details:
    - Set up base URL configuration using environment variable
    - Implemented token-based authentication in request interceptor
    - Created functions for fetchPrompts, generateProduct, saveProduct, fetchProductsToGrade, and gradeProduct

- Updated ProductGenerator component
  - Refactored to use new API utility functions
  - Improved error handling and debugging
  - Status: Implemented, needs testing
  - Technical details:
    - Replaced direct axios calls with new API utility functions
    - Updated error handling to provide more specific error messages
    - Refactored generateProduct and saveProduct functions

- Updated HumanGraderV2 component
  - Refactored to use new API utility functions
  - Improved error handling and debugging
  - Status: Implemented, needs testing
  - Technical details:
    - Replaced direct axios calls with new API utility functions
    - Updated error handling to provide more specific error messages
    - Refactored fetchProducts and handleGrade functions

## Update #14
- Updated API utility file (src/utils/api.js)
  - Added default baseURL to https://pavt-db.onrender.com
  - Implemented response interceptor for better error logging
  - Added timeout of 10 seconds to API calls
  - Status: Implemented, needs testing
  - Technical details:
    - Set default baseURL in axios.create
    - Added response interceptor to log detailed error information
    - Set timeout option in axios.create

- Updated ProductGenerator component
  - Enhanced error handling to provide more specific error messages
  - Improved debug logging for network errors
  - Status: Implemented, needs testing
  - Technical details:
    - Updated error handling in fetchPromptsData, handleGenerateProduct, and handleSaveProduct functions
    - Added specific error messages for network errors and server non-responses

## Update #15
- Updated API utility file (src/utils/api.js)
  - Added data validation checks for API responses
  - Status: Implemented, needs testing
  - Technical details:
    - Added checks for array responses in fetchPrompts and fetchProductsToGrade
    - Added checks for object responses in generateProduct, saveProduct, and gradeProduct
    - Throw custom errors if data is not in the expected format

- Updated ProductGenerator component
  - Simplified error handling to use new API utility error messages
  - Status: Implemented, needs testing
  - Technical details:
    - Removed redundant error checks that are now handled in the API utility
    - Updated error messages to directly use the error message from the API utility

## Update #16
- Updated API utility file (src/utils/api.js)
  - Increased timeout to 30 seconds
  - Added more detailed error logging
  - Added console.log statements for debugging API responses
  - Status: Implemented, needs testing
  - Technical details:
    - Updated timeout in axios.create to 30000 ms
    - Enhanced error logging in response interceptor
    - Added console.log statements in each API function to log response data

- Updated ProductGenerator component
  - No changes made, but component will benefit from improved API error logging

## Update #17
- Updated ProductGenerator component
  - Added editable prompts for Step 1 and Step 2
  - Restored save product functionality
  - Status: Implemented, needs testing
  - Technical details:
    - Added textarea inputs for Step 1 and Step 2 prompts
    - Implemented handlePromptChange function to update prompts
    - Re-added handleSaveProduct function

- Added dummyProducts.js
  - Created file with 5 dummy products for testing
  - Status: Implemented
  - Technical details:
    - Added dummy data for coffee beans and coffee pods with various attributes

- Updated HumanGraderV2 component
  - Implemented use of dummy products for testing
  - Status: Implemented, needs testing
  - Technical details:
    - Imported dummyProducts from new file
    - Updated fetchProducts function to use dummy data
    - Updated rendering of product attributes to handle arrays

- Next steps:
  - Test ProductGenerator with editable prompts and save functionality
  - Verify HumanGraderV2 works correctly with dummy data
  - Prepare for integration with backend API when ready