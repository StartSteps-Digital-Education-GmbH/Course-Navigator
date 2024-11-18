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

| **Endpoint**         | **Method** | **Description**                       | **Auth** |  
|-----------------------|------------|---------------------------------------|----------|  
| `/latest`            | GET        | Get latest news articles              | ❌       |  
| `/personalized`      | GET        | Get personalized news (categories)    | ✅       |  
| `/search`            | GET        | Search news articles                  | ✅       |  

##### **2.1. GET /latest**  
Fetches the latest news for public users (limited content).  

- **Query Parameters**  
  - `limit` (optional): Number of articles to return. Default: `5`.  

- **Response**  
```json
[
  {
    "id": "news123",
    "title": "Latest Tech News",
    "description": "Short description...",
    "url": "https://newsapi.org/article"
  }
]
```
- **Errors**  
  - `500`: External API error.  

---

##### **2.2. GET /personalized**  
Fetches news based on user preferences.  

- **Auth**: Bearer Token.  

- **Response**  
```json
[
  {
    "id": "news123",
    "title": "Tech Innovations",
    "description": "Short description...",
    "category": "Technology"
  }
]
```
- **Errors**  
  - `401`: Unauthorized.  

---

##### **2.3. GET /search**  
Searches news articles by keyword.  

- **Query Parameters**  
  - `q`: Search keyword.  

- **Response**  
```json
[
  {
    "id": "news123",
    "title": "News on AI",
    "description": "Short description..."
  }
]
```
- **Errors**  
  - `400`: Missing/invalid search query.  

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
