# 🎨 Component Library - Pinterest Style Gallery

## 📋 Project Overview

This is a **Pinterest-style component library gallery** where developers can:
- Browse beautiful UI components (buttons, navbars, cards, etc.)
- View live previews of each component (similar to Pinterest)
- Copy code with syntax highlighting
- Filter components by tags, search and category

**Think of it as:** A curated collection of reusable React/Tailwind components displayed in a masonry grid (like Pinterest), where clicking any component opens a modal with live preview and copyable code.

---

## 🧠 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Next.js 16** | React framework with App Router for file-based routing |
| **React 19** | UI library with newest features |
| **TypeScript** | Type safety and better DX (Developer Experience) |
| **Tailwind CSS v4** | Utility-first styling (PostCSS-based) |
| **Prisma** | Database ORM for PostgreSQL |
| **PostgreSQL** | Relational database |
| **Framer Motion** | Animation library |
| **Lucide React** | Icon library |
| **React Syntax Highlighter** | Code syntax highlighting |

---

## 📁 Project Structure

```
component-library/
├── 🗂️ prisma/                      # Database layer
│   ├── schema.prisma               # Database schema definition
│   ├── seed.ts                     # Database seeding script
│   └── migrations/                 # Database version history
│
├── 🗂️ src/
│   ├── 🗂️ app/                     # Next.js App Router
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── page.tsx                # Home page (main gallery)
│   │   ├── globals.css             # Global styles
│   │   └── 🗂️ api/                 # Backend API routes
│   │       ├── 🗂️ components/      # Component CRUD operations
│   │       ├── 🗂️ favorites/       # User favorites
│   │       └── 🗂️ seed/            # Database seeding endpoint
│   │
│   ├── 🗂️ components/              # React components
│   │   ├── 🗂️ demo/                # Actual UI demos to display
│   │   ├── 🗂️ gallery/             # Gallery display components
│   │   ├── 🗂️ layout/              # Header, footer, search
│   │   └── 🗂️ ui/                  # Reusable UI primitives
│   │
│   ├── 🗂️ lib/                     # Utilities & helpers
│   │   ├── componentRegistry.ts    # Central component catalog
│   │   ├── prisma.ts               # Prisma client singleton
│   │   └── utils.ts                # Utility functions
│   │
│   └── 🗂️ types/                   # TypeScript definitions
│       └── component.ts            # Component metadata types
│
├── 📄 package.json                 # Dependencies & scripts
├── 📄 tsconfig.json                # TypeScript config
├── 📄 next.config.ts               # Next.js config
├── 📄 postcss.config.mjs           # PostCSS config
└── 📄 .env                         # Environment variables
```

---

## 🗄️ Database & Prisma Setup

### What is Prisma?

Prisma is a **type-safe database ORM** that:
- Generates TypeScript types from your schema
- Provides a clean API to query the database
- Handles migrations automatically
- Works with PostgreSQL, MySQL, SQLite, etc.

### Prisma Commands Explained

#### 1. `npm run prisma:generate`
**What it does:**
- Reads `prisma/schema.prisma` file
- Looks at all your database models (like Components, Favorite, User, etc.)
- Automatically creates TypeScript code that lets you talk to your database easily

**When to use:** After changing your schema, before using Prisma in your code

---

#### 2. `npm run prisma:migrate`
**What it does:**
- Changes your real database to match your code
- Keeps a version history of every change you make to your database (inside `prisma/migrations`)

**When to use:** When you want to track changes and work in a team (production-ready)

---

#### 3. `npm run db:push`
**What it does:**
- Just makes the database match your schema — no history needed
- Doesn't create migration files
- It's faster

**When to use:** Good for early testing or prototyping

---

#### 4. `npm run db:studio`
**What it does:**
- Opens a visual dashboard for your database
- See all your tables (like User, Component, etc.)
- Add, edit, or delete rows
- Explore data without writing any SQL

**When to use:** Perfect for debugging or checking that data is being saved correctly

---

#### 5. `npm run prisma:seed`
**What it does:**
- Fills your database with sample data
- In simple words: Add some fake or starter data so I can test my app

**When to use:** After running migrations, to populate your empty database

---

### Database Setup Flow

1. **Set environment variable (`.env`)**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/component_library"
   ```

2. **Initialize database**
   ```bash
   npm run prisma:migrate
   ```

3. **Seed with data**
   ```bash
   npm run prisma:seed
   ```

---

## 🏗️ Architecture Deep Dive

### Database Schema (`prisma/schema.prisma`)

```prisma
// Main table: Stores all UI components
model Component {
  id           String   @id @default(cuid())      // Unique ID (auto-generated)
  name         String                              // "Glassmorphism Navbar"
  description  String                              // Short summary
  category     String                              // "navbar", "button", "card"
  tags         String[]                            // ["glassmorphism", "modern"]
  filePath     String                              // Path to component file
  componentPath String                             // Import path
  code         String   @db.Text                   // Full source code
  dependencies String[]                            // ["lucide-react"]
  responsive   Boolean  @default(true)
  darkMode     Boolean  @default(true)
  views        Int      @default(0)                // View counter
  copies       Int      @default(0)                // Copy counter
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  favorites    Favorite[]                          // Relation to favorites
  versions     ComponentVersion[]                  // Version history
}
```

**Why each field exists:**
- `id`: Unique identifier for database operations
- `name`: Display name in the gallery
- `description`: Shows on component cards
- `category`: Helps with filtering (navbar, button, card, etc.)
- `tags`: Multiple tags for flexible search/filtering
- `filePath`: Where the component file lives in your project
- `componentPath`: Import path for dynamic loading
- `code`: The actual source code shown in the modal
- `dependencies`: Shows what libraries the component needs
- `responsive`: Badge to show mobile-friendly components
- `darkMode`: Badge to show dark mode support
- `views`: Analytics - tracks how many times component was viewed
- `copies`: Analytics - tracks how many times code was copied

---

### How Data Flows Through the App

```
1. DATABASE (PostgreSQL)
   ↓
2. PRISMA CLIENT (Type-safe ORM)
   ↓
3. API ROUTES (Next.js serverless functions)
   ↓
4. FRONTEND (React components)
   ↓
5. USER INTERFACE (Browser)
```

#### Example: User Searches for "glass"

```
1. User types "glass" in SearchBar
   ↓
2. SearchBar calls: onSearch("glass")
   ↓
3. page.tsx updates state: setSearch("glass")
   ↓
4. useEffect triggers because [search] changed
   ↓
5. Fetch request: GET /api/components?search=glass
   ↓
6. API route receives request
   ↓
7. Prisma queries database with WHERE clause
   ↓
8. Database returns matching rows
   ↓
9. API sends JSON response
   ↓
10. page.tsx updates: setComponents(data)
   ↓
11. MasonryGrid re-renders with filtered components
   ↓
12. User sees updated gallery
```

---

## 🚀 Getting Started

### Installation

```bash
# 1. Clone repository
git clone <your-repo-url>
cd component-library

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL

# 4. Setup database
npm run prisma:migrate
npm run prisma:generate

# 5. Seed database with sample components
npm run prisma:seed

# 6. Start development server
npm run dev

# 7. Open http://localhost:3000
```

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality

# Prisma commands
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio GUI
```

---

## 🎨 Adding New Components

### Step-by-Step Guide

1. **Create component file**
   ```bash
   touch src/components/demo/buttons/NewButton.tsx
   ```

2. **Write your component**
   ```typescript
   'use client';
   
   export default function NewButton() {
     return (
       <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600">
         New Button
       </button>
     );
   }
   ```

3. **Add to componentRegistry.ts**
   ```typescript
   {
     id: "new-button-1",
     name: "New Button",
     description: "A simple blue button",
     category: "button",
     tags: ["button", "simple", "blue"],
     filePath: "/components/demo/buttons/NewButton.tsx",
     componentPath: "@/components/demo/buttons/NewButton",
     code: `'use client';\n\nexport default function NewButton() { ... }`,
     dependencies: [],
     responsive: true,
     darkMode: true,
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString(),
   }
   ```

4. **Import in ComponentCard.tsx**
   ```typescript
   import NewButton from "@/components/demo/buttons/NewButton";
   
   const componentMap = {
     // ... existing components
     "new-button-1": NewButton,
   };
   ```

5. **Import in ComponentModal.tsx** (same as above)

6. **Re-seed database**
   ```bash
   npm run prisma:seed
   ```

7. **Refresh browser and test!**

---

## 📚 Learning Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **React 19:** https://react.dev

---

## 🎯 Future Enhancements

- [ ] User authentication (NextAuth.js)
- [ ] Admin panel for CRUD operations
- [ ] Component version history
- [ ] User comments and ratings
- [ ] Dark mode toggle
- [ ] Export components as package

---

## 📄 License

MIT License - Feel free to use this project for learning and personal projects!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
