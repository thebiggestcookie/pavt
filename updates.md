# Updates

## 2023-06-14
- Fixed ProductGenerator component
- Issue: Prompts were not being fetched from the backend
- Solution: Added useEffect to fetch prompts on component mount
- Added error handling for JSON parsing of LLM response
- Implemented two-step generation process (subcategory, then attributes)