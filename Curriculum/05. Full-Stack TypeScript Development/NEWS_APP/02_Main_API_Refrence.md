### API Documentation  

#### **1. Authentication API**  

**Base URL**: `/api/auth`  

| **Endpoint**         | **Method** | **Description**              | **Auth** |  
|-----------------------|------------|------------------------------|----------|  
| `/register`           | POST       | Register a new user          | ❌       |  
| `/login`              | POST       | Login and get a JWT token    | ❌       |  
| `/profile`            | GET        | Fetch user profile           | ✅       |  

##### **1.1. POST /register**  
Registers a new user.  

- **Request**  
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**  
```json
{
  "message": "User registered successfully",
  "userId": "abc123"
}
```
- **Errors**  
  - `400`: Validation errors (e.g., invalid email).  
  - `409`: Email already exists.  

---

##### **1.2. POST /login**  
Authenticates a user and returns a JWT token.  

- **Request**  
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**  
```json
{
  "token": "jwt-token-here"
}
```
- **Errors**  
  - `401`: Invalid email/password.  

---

##### **1.3. GET /profile**  
Fetches the authenticated user's profile.  

- **Auth**: Bearer Token.  
- **Response**  
```json
{
  "userId": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "preferences": ["Technology", "Sports"]
}
```
- **Errors**  
  - `401`: Unauthorized (invalid/missing token).  

---

#### **2. News API**  

**Base URL**: `/api/news`

| **Endpoint**          | **Method** | **Description**                               | **Auth** |
|------------------------|------------|-----------------------------------------------|----------|
| `/latest`             | GET        | Fetch the latest news articles               | ❌       |
| `/headlines`          | GET        | Fetch top headlines                          | ✅       |
| `/personalized`       | GET        | Fetch personalized news based on categories  | ✅       |
| `/search`             | GET        | Search news articles                         | ✅       |
| `/sources`            | GET        | Fetch available news sources                 | ❌       |

---

##### **2.1. GET /latest**

Fetches the latest news using NewsAPI's `/everything` endpoint.

- **Query Parameters**
  - `q` (optional): Search keyword.
  - `limit` (optional): Number of articles to return. Default: `5`.
  - `sortBy` (optional): Sorting criteria (`relevancy`, `popularity`, `publishedAt`). Default: `publishedAt`.

- **Example Request**
```http
GET /api/news/latest?q=technology&limit=5&sortBy=popularity
```

- **Response**
```json
[
  {
    "id": "news123",
    "title": "Latest Tech News",
    "description": "Short description...",
    "url": "https://example.com/article",
    "source": "TechCrunch",
    "publishedAt": "2024-12-01T10:00:00Z"
  }
]
```

- **Backend Logic**
  Calls NewsAPI's `/everything` endpoint with the provided parameters:
  ```http
  GET https://newsapi.org/v2/everything?q=technology&sortBy=popularity&apiKey=YOUR_API_KEY
  ```

- **Errors**
  - `500`:  
```json
{
  "message": "Error fetching latest news",
  "error": "Error details here"
}
```

---

##### **2.2. GET /headlines**

Fetches top headlines using NewsAPI's `/top-headlines` endpoint.

- **Query Parameters**
  - `country` (optional): Country code (e.g., `us`, `in`).
  - `category` (optional): News category (e.g., `technology`, `sports`).
  - `limit` (optional): Number of articles to return. Default: `5`.

- **Example Request**
```http
GET /api/news/headlines?country=us&category=technology&limit=5
```

- **Response**
```json
[
  {
    "id": "news456",
    "title": "Breaking Tech News",
    "description": "Short description...",
    "url": "https://example.com/article",
    "source": "The Verge",
    "publishedAt": "2024-12-01T12:00:00Z"
  }
]
```

- **Backend Logic**
  Calls NewsAPI's `/top-headlines` endpoint with the provided parameters:
  ```http
  GET https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=YOUR_API_KEY
  ```

- **Errors**
  - `500`:  
```json
{
  "message": "Error fetching top headlines",
  "error": "Error details here"
}
```

---

##### **2.3. GET /personalized**

Fetches personalized news based on user preferences using NewsAPI's `/everything` endpoint.

- **Auth**: Bearer Token.
- **Query Parameters**
  - `categories`: Comma-separated list of categories (e.g., `technology,health`).
  - `limit` (optional): Number of articles to return. Default: `10`.

- **Example Request**
```http
GET /api/news/personalized?categories=technology,health&limit=10
```

- **Response**
```json
[
  {
    "id": "news789",
    "title": "AI Breakthroughs",
    "description": "Short description...",
    "url": "https://example.com/article",
    "source": "BBC",
    "publishedAt": "2024-12-01T15:00:00Z"
  }
]
```

- **Backend Logic**
  Calls NewsAPI's `/everything` endpoint with category-related filters:
  ```http
  GET https://newsapi.org/v2/everything?q=technology,health&apiKey=YOUR_API_KEY
  ```

- **Errors**
  - `401`:  
```json
{
  "message": "Unauthorized access"
}
```
  - `500`:  
```json
{
  "message": "Error fetching personalized news",
  "error": "Error details here"
}
```

---

##### **2.4. GET /search**

Searches news articles by keyword using NewsAPI's `/everything` endpoint.

- **Query Parameters**
  - `q`: Search keyword.
  - `from` (optional): Start date in `YYYY-MM-DD` format.
  - `to` (optional): End date in `YYYY-MM-DD` format.
  - `sortBy` (optional): Sorting criteria (`relevancy`, `popularity`, `publishedAt`).

- **Example Request**
```http
GET /api/news/search?q=climate&from=2024-11-01&to=2024-12-01&sortBy=popularity
```

- **Response**
```json
[
  {
    "id": "news101",
    "title": "Climate Change Update",
    "description": "Short description...",
    "url": "https://example.com/article",
    "source": "CNN",
    "publishedAt": "2024-12-01T08:00:00Z"
  }
]
```

- **Backend Logic**
  Calls NewsAPI's `/everything` endpoint:
  ```http
  GET https://newsapi.org/v2/everything?q=climate&from=2024-11-01&to=2024-12-01&sortBy=popularity&apiKey=YOUR_API_KEY
  ```

- **Errors**
  - `400`:  
```json
{
  "message": "Invalid or missing search query"
}
```
  - `500`:  
```json
{
  "message": "Error searching news",
  "error": "Error details here"
}
```

---

##### **2.5. GET /sources**

Fetches available news sources using NewsAPI's `/sources` endpoint.

- **Query Parameters**
  - `category` (optional): News category (e.g., `technology`, `sports`).
  - `country` (optional): Country code (e.g., `us`, `in`).

- **Example Request**
```http
GET /api/news/sources?category=technology&country=us
```

- **Response**
```json
[
  {
    "id": "cnn",
    "name": "CNN",
    "category": "general",
    "language": "en",
    "country": "us"
  }
]
```

- **Backend Logic**
  Calls NewsAPI's `/sources` endpoint:
  ```http
  GET https://newsapi.org/v2/sources?category=technology&country=us&apiKey=YOUR_API_KEY
  ```

- **Errors**
  - `500`:  
```json
{
  "message": "Error fetching news sources",
  "error": "Error details here"
}
```

---

#### **3. Bookmark & History API**  

**Base URL**: `/api/bookmarks`  

| **Endpoint**        | **Method** | **Description**            | **Auth** |  
|----------------------|------------|----------------------------|----------|  
| `/`                 | POST       | Bookmark a news article    | ✅       |  
| `/`                 | GET        | Get all bookmarks          | ✅       |  
| `/history`          | GET        | Get user’s reading history | ✅       |  

##### **3.1. POST /**  
Adds a news article to bookmarks.  

- **Request**  
```json
{
  "articleId": "news123"
}
```
- **Response**  
```json
{
  "message": "Article bookmarked successfully"
}
```
- **Errors**  
  - `400`: Missing/invalid `articleId`.  

---

##### **3.2. GET /**  
Fetches all bookmarked articles for the user.  

- **Auth**: Bearer Token.  
- **Response**  
```json
[
  {
    "id": "news123",
    "title": "Interesting News",
    "url": "https://newsapi.org/article"
  }
]
```
- **Errors**  
  - `401`: Unauthorized.  

---

#### **4. Comments API**  

**Base URL**: `/api/comments`  

| **Endpoint**        | **Method** | **Description**          | **Auth** |  
|----------------------|------------|--------------------------|----------|  
| `/`                 | POST       | Add a comment            | ✅       |  
| `/:articleId`       | GET        | Get comments for article | ✅       |  

##### **4.1. POST /**  
Adds a comment to an article.  

- **Request**  
```json
{
  "articleId": "news123",
  "comment": "Great article!"
}
```
- **Response**  
```json
{
  "message": "Comment added successfully"
}
```
- **Errors**  
  - `400`: Missing/invalid input.  

---

##### **4.2. GET /:articleId**  
Fetches all comments for a specific article.  

- **Response**  
```json
[
  {
    "commentId": "cmt123",
    "userId": "abc123",
    "comment": "Great article!",
    "timestamp": "2024-11-18T10:00:00Z"
  }
]
```
- **Errors**  
  - `404`: Article not found.  

---
