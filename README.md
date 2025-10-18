# Product Management App

A modern full-stack **Product Management Dashboard** built with **Next.js 14**, **Redux Toolkit Query**, and **ShadCN UI** — featuring authentication, Cloudinary image uploads, and CRUD operations with a clean professional dashboard layout.

---

##  Quick Start

```bash
# install dependencies
npm install

# run development
npm run dev

# build for production
npm run build

# start production
npm run start

## Environment Setup

Create a .env.local file in the project root:

NEXT_PUBLIC_API_URL=https://api.bitechx.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=


## Core Features

Authentication System — Secure login/register with token stored in cookies.
Product CRUD — Create, Read, Update, and Delete products via RTK Query.
Cloudinary Integration — Upload, preview, and manage product images.
Dashboard Layout — Responsive UI with Sidebar + Topbar combo.
Routing System — Next.js App Router with nested layouts.
RTK Query Caching — Automatic data re-fetching and cache updates.
Responsive Design — Built with ShadCN + Tailwind v4 for modern UI.
TypeScript Strict Mode — Full type safety across the app.
Toast & Dialog Feedback — Real-time user feedback using react-hot-toast and custom confirm dialogs.


Project Structure

src/
├─ app/
│  ├─ layout.tsx                # Root layout (fonts, providers)
│  ├─ page.tsx                  # Redirect to /products
│  ├─ error.tsx                 # Optional global error boundary
│  └─ (dashboard)/
│     ├─ layout.tsx             # Dashboard layout (Sidebar + Topbar + Main)
│     └─ products/
│        ├─ page.tsx            # Product list (table/grid)
│        ├─ new/page.tsx        # Add new product form
│        └─ [id]/edit/page.tsx  # Edit existing product
├─ components/                  # UI components (Form, Modal, Card, etc.)
├─ redux/
│  ├─ store.ts                  # Redux store setup
│  ├─ hooks.ts                  # Typed hooks (useAppDispatch, useAppSelector)
│  └─ features/
│     ├─ apiSlice.ts            # RTK Query base API config
│     ├─ productApi.ts          # Product endpoints (CRUD)
│     └─ authSlice.ts           # Auth state (token)
├─ types/
│  └─ product.ts                # Product & Category types
├─ lib/
│  └─ cloudinary.ts             # Cloudinary helper (upload/delete)
└─ utils/
   └─ helpers.ts                # Optional util functions

## Tech Stack

⚛️ Next.js 14 (App Router)

🧠 Redux Toolkit Query

🎨 Tailwind CSS v4 + ShadCN UI

☁️ Cloudinary

🍪 Cookie-based Auth

🧾 TypeScript

