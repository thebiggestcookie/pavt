# Updates

## Update #18
- Updated ProductGenerator component
  - Added functionality to show and edit prompts
  - Implemented display of generated products with save buttons
  - Status: Implemented, needs testing
  - Technical details:
    - Added state for showing/hiding prompts
    - Created a list to store and display generated products
    - Implemented save functionality for individual products

- Updated HumanGraderV2 component
  - Added dropdown menus for attribute modification
  - Status: Implemented, needs testing
  - Technical details:
    - Imported attributes from new attributes.js file
    - Implemented handleAttributeChange function for updating attributes
    - Updated attribute display to use select elements

- Added attributes.js file
  - Created structured attributes for coffee beans and coffee pods
  - Status: Implemented
  - Technical details:
    - Defined attributes object with subcategories and their respective attributes
    - Included various options for each attribute

- Next steps:
  - Test ProductGenerator with new prompt editing and product saving features
  - Verify HumanGraderV2 works correctly with attribute dropdowns
  - Ensure attributes in attributes.js cover all necessary options for coffee beans and pods
  - Consider adding more subcategories and attributes as needed
  - Prepare for integration with backend API when ready