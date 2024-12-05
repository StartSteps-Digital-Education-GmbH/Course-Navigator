### 1. **GET /latest**
- **Validation Tests**:
  - Default query parameters (`limit=5`, `sortBy=publishedAt`).
  - Valid query parameters (`q`, `limit`, `sortBy`).
  - Invalid `limit` values (below minimum, above maximum, non-numeric).
  - Invalid `sortBy` value.

- **Successful API Response Tests**:
  - Fetch latest articles with default parameters.
  - Filter articles using `q` and verify relevance.
  - Limit the number of articles.
  - Sort results by valid `sortBy` values.

- **Error Handling**:
  - Invalid query parameters return appropriate errors.
  - NewsAPI service errors are handled gracefully (e.g., 500 errors).

---

### 2. **GET /headlines**
- **Validation Tests**:
  - Default query parameters (`limit=5`).
  - Valid query parameters (`country`, `category`, `limit`).
  - Invalid `country` or `category` values (non-existent, empty strings).
  - Invalid `limit` values (below minimum, above maximum, non-numeric).

- **Successful API Response Tests**:
  - Fetch headlines with default parameters.
  - Filter headlines by `country` and `category`.
  - Verify the number of articles matches `limit`.

- **Error Handling**:
  - Missing or invalid query parameters return appropriate errors.
  - Handle 401 errors when authorization fails.
  - Gracefully handle service errors from NewsAPI.

---

### 3. **GET /personalized**
- **Validation Tests**:
  - Valid authorization token is required.
  - Validate `categories` parameter (comma-separated format).
  - Default `limit` applied when not provided.
  - Invalid `limit` or `categories` values.

- **Successful API Response Tests**:
  - Fetch personalized articles based on `categories`.
  - Limit the number of articles.
  - Handle multiple categories and ensure results are accurate.

- **Error Handling**:
  - Missing or invalid auth token returns a 401 error.
  - Invalid query parameters return appropriate errors.
  - Service errors from NewsAPI (e.g., 500) are gracefully handled.

---

### 4. **GET /search**
- **Validation Tests**:
  - Validate required `q` parameter.
  - Optional parameters (`from`, `to`, `sortBy`) are handled correctly.
  - Invalid date formats for `from` and `to`.
  - Invalid `sortBy` value.

- **Successful API Response Tests**:
  - Search articles by keyword.
  - Filter articles within a date range (`from`, `to`).
  - Sort results by valid `sortBy` values.
  - Combine multiple filters and verify results.

- **Error Handling**:
  - Missing or invalid `q` parameter returns a 400 error.
  - Handle invalid date formats for `from` and `to`.
  - Service errors from NewsAPI (e.g., 500) are gracefully handled.

---

### 5. **GET /sources**
- **Validation Tests**:
  - Default behavior when no parameters are provided.
  - Validate optional query parameters (`category`, `country`).
  - Invalid `category` or `country` values.

- **Successful API Response Tests**:
  - Fetch news sources with default parameters.
  - Filter sources by `category` or `country`.

- **Error Handling**:
  - Missing or invalid query parameters return appropriate errors.
  - Service errors from NewsAPI (e.g., 500) are gracefully handled.

---

### Key Focus for Tests:
1. Ensure query parameters are validated and processed correctly.
2. Test all default behaviors (e.g., fallback to defaults when parameters are missing).
3. Simulate success and failure scenarios, especially for external API interactions.
4. Cover authorization-specific endpoints with token validation.
5. Handle edge cases like empty results, invalid inputs, or API unavailability.
