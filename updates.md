# Updates

## 2023-06-14
- Fixed ProductGenerator component
- Issue: Prompts were not being fetched from the backend
- Solution: Added useEffect to fetch prompts on component mount
- Added error handling for JSON parsing of LLM response
- Implemented two-step generation process (subcategory, then attributes)

## 2023-06-15
- Enhanced ProductGenerator component
  - Added display of prompts
  - Implemented debug information display
  - Added save product functionality
- Updated HumanGraderV2 component
  - Implemented fetching of products to grade
  - Added grading functionality
  - Displayed product attributes for grading