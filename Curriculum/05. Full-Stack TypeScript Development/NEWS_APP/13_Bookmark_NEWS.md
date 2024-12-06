### **1. Design Best Practices**
#### **General Guidelines**
- **Unique Identifiers**: Use the `url` as the unique identifier for articles since external APIs often lack unique IDs. Pair it with `user_id` to prevent conflicts in bookmarks and history.
- **Database Normalization**: Store articles in a dedicated `NewsArticles` table to avoid redundancy. Only store references in the `Bookmarks` and `History` tables.
- **Indexing**: Optimize database queries with proper indexing, e.g., on `user_id` and `url`.
- **Timestamps**: Include timestamps to track when a bookmark or history entry was created/updated for features like "Recently Bookmarked" or "Last Viewed."
- **Validation**: Use schema validation (e.g., `Joi`) to ensure consistent data input.

#### **Avoiding Duplicates**
- Before inserting a bookmark or history entry, check for existing records using a combination of `user_id` and `article_id`.
- Implement middleware or validation layers to enforce uniqueness.

---

### **2. Validation Schema (Joi)**
Define schemas to validate API requests for bookmarks and history.

#### **Bookmark Validation**
```typescript
import Joi from "joi";

export const createBookmarkSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    "string.uri": "Invalid URL format.",
    "any.required": "The 'url' field is required.",
  }),
  title: Joi.string().required().messages({
    "any.required": "The 'title' field is required.",
  }),
  description: Joi.string().allow("").optional(),
  imageUrl: Joi.string().uri().optional(),
  category: Joi.string().optional(),
  publishedAt: Joi.date().iso().optional(),
  sourceName: Joi.string().optional(),
});
```

#### **History Validation**
```typescript
export const createHistorySchema = Joi.object({
  userId: Joi.string().uuid().required(),
  url: Joi.string().uri().required(),
});
```

---

### **4. API Endpoints**
#### **Bookmark Endpoints**
- `POST /api/bookmarks`: Add a bookmark.
- `GET /api/bookmarks`: Retrieve all bookmarks.
- `DELETE /api/bookmarks/:id`: Remove a bookmark.

#### **History Endpoints**
- `POST /api/history`: Log article view.
- `GET /api/history`: Retrieve recent history for a user.

---

### **5. Example Code**
#### **Entities**
##### **NewsArticle Entity**
```typescript
@Entity("NewsArticles")
export class NewsArticle {
  @PrimaryGeneratedColumn("uuid")
  articleId: string;

  @Column({ unique: true })
  url: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  sourceName: string;

  @Column({ type: "timestamp", nullable: true })
  publishedAt: Date;
}
```

##### **Bookmark Entity**
```typescript
@Entity("Bookmarks")
export class Bookmark {
  @PrimaryGeneratedColumn("uuid")
  bookmarkId: string;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => NewsArticle, (article) => article.bookmarks, { onDelete: "CASCADE" })
  article: NewsArticle;

  @CreateDateColumn()
  createdAt: Date;
}
```

##### **History Entity**
```typescript
@Entity("History")
export class History {
  @PrimaryGeneratedColumn("uuid")
  historyId: string;

  @ManyToOne(() => User, (user) => user.history, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => NewsArticle, (article) => article.history, { onDelete: "CASCADE" })
  article: NewsArticle;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastViewed: Date;
}
```

#### **Controller**
##### **Create Bookmark**
```typescript
export const createBookmark = async (req: Request, res: Response) => {
  const { url, title, description, imageUrl, category, publishedAt, sourceName } = req.body;
  const user = req.user; // Middleware adds authenticated user to request

  try {
    const articleRepo = AppDataSource.getRepository(NewsArticle);
    const bookmarkRepo = AppDataSource.getRepository(Bookmark);

    // Check if article exists or create it
    let article = await articleRepo.findOneBy({ url });
    if (!article) {
      article = articleRepo.create({ url, title, description, imageUrl, category, publishedAt, sourceName });
      await articleRepo.save(article);
    }

    // Check for duplicate bookmark
    const existingBookmark = await bookmarkRepo.findOneBy({ user, article });
    if (existingBookmark) return res.status(400).json({ message: "Article already bookmarked." });

    // Create bookmark
    const bookmark = bookmarkRepo.create({ user, article });
    await bookmarkRepo.save(bookmark);

    res.status(201).json({ message: "Bookmark created." });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};
```
