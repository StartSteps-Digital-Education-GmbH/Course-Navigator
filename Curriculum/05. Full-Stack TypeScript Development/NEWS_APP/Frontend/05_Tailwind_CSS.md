## **2. Install Tailwind CSS and Peer Dependencies**
Install Tailwind CSS along with PostCSS and Autoprefixer:
```bash
npm install -D tailwindcss postcss autoprefixer
```
Initialize the `tailwind.config.js` and `postcss.config.js` files:
```bash
npx tailwindcss init -p
```

## **3. Add Tailwind CSS Import to `src/index.css`**
In your `src/index.css`, add:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS, if any */
```

## **4. Update Tailwind Template Paths**
Configure the content paths in `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#FFFFFF",
          foreground: "#000000",
        },
        dark: {
          background: "#18181B",
          foreground: "#F5F5F5",
        },
      },
    },
  },
  plugins: [],
};
```

## **5. Enable Themes (Light/Dark Mode)**
Update your `index.html` file to support `dark` mode by adding a class to the `<html>` tag dynamically:
```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body class="bg-light-background text-light-foreground dark:bg-dark-background dark:text-dark-foreground">
    <div id="root"></div>
  </body>
</html>
```

To toggle the theme dynamically, use JavaScript in your app:
```javascript
function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle("dark");
}
```

## **6. Update TypeScript Configuration**
Edit `tsconfig.json` and `tsconfig.app.json` files to support absolute imports:
### tsconfig.json:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### tsconfig.app.json:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## **7. Update Vite Configuration**
Add path resolution for imports in `vite.config.ts`:
```bash
npm install -D @types/node
```
Then modify the configuration:
```typescript
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## **8. Integrate Shadcn-UI**
Run the CLI command:
```bash
npx shadcn@latest init
```
Configure your components using the CLI prompts. For example:
- Base style: New York.
- Base color: Zinc.
- Use CSS variables for colors: Yes/No (choose as required).

## **9. Customize Colors for Light/Dark Mode**
Modify `tailwind.config.js` colors or extend Shadcn-UI theme customization to fit your needs:
```javascript
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#a8dadc",
          DEFAULT: "#457b9d",
          dark: "#1d3557",
        },
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
```

---

This will set you up with Tailwind CSS, light/dark mode support, and compatibility with Shadcn-UI components. From here, further customization and UI building can begin!
