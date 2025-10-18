#  Product Management Dashboard

A modern full-stack **Product Management Dashboard** built with **Next.js 14** (App Router), **Redux Toolkit Query**, and **ShadCN UI** ✨. This application features secure **cookie-based authentication**, **Cloudinary** image uploads, and full **CRUD** operations for products, all presented in a clean, professional dashboard layout.

---

##  Core Features

| Feature | Description |
| :--- | :--- |
| **Authentication System** | Secure login/register flow with authentication token stored in cookies. |
| **Product CRUD** | Complete Create, Read, Update, and Delete operations for products managed via **RTK Query**. |
| **Cloudinary Integration** | Seamlessly upload, preview, and manage product images with the Cloudinary service. |
| **Dashboard Layout** | Responsive UI featuring a classic **Sidebar + Topbar** combination. |
| **Routing System** | Structured routing with the **Next.js App Router** and nested layouts. |
| **RTK Query Caching** | Automatic data re-fetching, caching, and state updates for a performant experience. |
| **Modern UI** | Fully **Responsive Design** built with **ShadCN UI** and **Tailwind CSS v4**. |
| **Type Safety** | Developed with **TypeScript Strict Mode** for full type safety across the application. |
| **User Feedback** | Real-time user feedback using \`react-hot-toast\` for toasts and custom dialogs for confirmations. |

---

##  Tech Stack

This project is built using a robust and modern stack:

* ⚛️ **Next.js 14** (App Router)
* 🧠 **Redux Toolkit Query (RTK Query)**
* 🎨 **Tailwind CSS v4** + **ShadCN UI**
* ☁️ **Cloudinary** for media asset management
* 🔒 **Cookie-based Auth**
* 📜 **TypeScript**

---

##  Quick Start

Follow these steps to get your local development environment running.

### 1. Installation

\`\`\`bash
# install dependencies
npm install
\`\`\`

### 2. Run Locally

\`\`\`bash
# run development server
npm run dev
\`\`\`

### 3. Production Build

\`\`\`bash
# build for production
npm run build

# start production server
npm run start
\`\`\`

---

##  Environment Setup

Create a file named **\`.env.local\`** in the project's root directory and populate it with your configuration:

\`\`\`ini
# API URL for your backend services
NEXT_PUBLIC_API_URL=https://api.bitechx.com

# Cloudinary credentials for image management
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=YOUR_CLOUDINARY_UPLOAD_PRESET
\`\`\`

---

##  Project Structure

The application follows a standard Next.js App Router structure, organizing core logic with Redux Toolkit and utility functions in dedicated directories.

\`\`\`
src/
├─ app/
│  ├─ layout.tsx                  # Root layout (fonts, providers)
│  ├─ page.tsx                    # Redirect to /products
│  ├─ error.tsx                   # Optional global error boundary
│  └─ (dashboard)/
│     ├─ layout.tsx               # Dashboard layout (Sidebar + Topbar + Main)
│     └─ products/
│        ├─ page.tsx              # Product list (table/grid view)
│        ├─ new/page.tsx          # Add new product form
│        └─ [id]/edit/page.tsx    # Edit existing product
├─ components/                    # Reusable UI components (Form, Modal, Card, etc.)
├─ redux/
│  ├─ store.ts                    # Redux store setup
│  ├─ hooks.ts                    # Typed hooks (useAppDispatch, useAppSelector)
│  └─ features/
│     ├─ apiSlice.ts              # RTK Query base API configuration
│     ├─ productApi.ts            # Product endpoints (CRUD)
│     └─ authSlice.ts             # Auth state (token handling)
├─ types/
│  └─ product.ts                  # TypeScript types for Products & Categories
├─ lib/
│  └─ cloudinary.ts               # Cloudinary helper functions (upload/delete)
└─ utils/
   └─ helpers.ts                  # Optional utility functions (formatting, validation, etc.)
\`\`\`

