### **Tables and Columns**

[Diagram Refrence](https://roadmap.sh/r/er-diagram---news-app)

#### 1. **Users**
- **user_id**: `UUID` (Primary Key)
- **name**: `VARCHAR(255)` (User's full name)
- **email**: `VARCHAR(255)` (Unique, user email)
- **password**: `VARCHAR(255)` (Hashed password)
- **created_at**: `TIMESTAMP` (Account creation time)
- **updated_at**: `TIMESTAMP` (Last update time)

---

#### 2. **News Articles**
- **article_id**: `UUID` (Primary Key)
- **api_id**: `VARCHAR(255)` (ID from NewsAPI)
- **title**: `TEXT` (News title)
- **description**: `TEXT` (News description/summary)
- **url**: `TEXT` (News article URL)
- **image_url**: `TEXT` (URL to the article's image)
- **category**: `VARCHAR(100)` (e.g., Technology, Sports)
- **published_at**: `TIMESTAMP` (Publication date/time)
- **source_name**: `VARCHAR(255)` (e.g., CNN, BBC)

---

#### 3. **Bookmarks**
- **bookmark_id**: `UUID` (Primary Key)
- **user_id**: `UUID` (Foreign Key to Users)
- **article_id**: `UUID` (Foreign Key to News Articles)
- **created_at**: `TIMESTAMP` (Bookmark creation date)

---

#### 4. **Comments**
- **comment_id**: `UUID` (Primary Key)
- **user_id**: `UUID` (Foreign Key to Users)
- **article_id**: `UUID` (Foreign Key to News Articles)
- **content**: `TEXT` (User’s comment text)
- **created_at**: `TIMESTAMP` (Comment creation time)

---

#### 5. **User Preferences**
- **preference_id**: `UUID` (Primary Key)
- **user_id**: `UUID` (Foreign Key to Users)
- **category**: `VARCHAR(100)` (Preferred news category, e.g., Technology, Sports)

---

#### 6. **History**
- **history_id**: `UUID` (Primary Key)
- **user_id**: `UUID` (Foreign Key to Users)
- **article_id**: `UUID` (Foreign Key to News Articles)
- **viewed_at**: `TIMESTAMP` (Date/time the article was viewed)

---

### **Relationships**

1. **Users ↔ Bookmarks**  
   - One-to-Many: A user can bookmark multiple articles.  
   - Foreign Key: `user_id` in **Bookmarks**.

2. **Users ↔ Comments**  
   - One-to-Many: A user can comment on multiple articles.  
   - Foreign Key: `user_id` in **Comments**.

3. **Users ↔ User Preferences**  
   - One-to-Many: A user can have multiple preferences (categories).  
   - Foreign Key: `user_id` in **User Preferences**.

4. **Users ↔ History**  
   - One-to-Many: A user can view multiple articles, tracked in the history.  
   - Foreign Key: `user_id` in **History**.

5. **News Articles ↔ Bookmarks**  
   - One-to-Many: An article can be bookmarked by multiple users.  
   - Foreign Key: `article_id` in **Bookmarks**.

6. **News Articles ↔ Comments**  
   - One-to-Many: An article can have multiple comments.  
   - Foreign Key: `article_id` in **Comments**.

7. **News Articles ↔ History**  
   - One-to-Many: An article can appear in multiple users' history records.  
   - Foreign Key: `article_id` in **History**.

---

### **Optional: Metadata Table for Trending**

#### 7. **Article Engagement**
- **engagement_id**: `UUID` (Primary Key)
- **article_id**: `UUID` (Foreign Key to News Articles)
- **views**: `INT` (Total views for the article)
- **likes**: `INT` (Total likes for the article)
- **shares**: `INT` (Total shares for the article)

This table helps calculate trending articles if needed.

---

### ER Diagram Overview
- **Users**:
  - Core entity related to **Bookmarks**, **Comments**, **Preferences**, and **History**.  
- **News Articles**:
  - Central entity connecting **Bookmarks**, **Comments**, and **History**.  
- **Many-to-Many Relationships**:
  - User and News has M2M Relationship and its achieved through associative tables like **Bookmarks** and **History**.  
