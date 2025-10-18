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

\`\`\`
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
│  ├─ layout.tsx                # root layout (fonts, global provider)
│  ├─ page.tsx                  # root page (redirect to /products)
│  ├─ error.tsx                 # optional global error boundary
│  └─ globals.css
│  └─ (dashboard)/
│     ├─ layout.tsx             # dashboard layout (Sidebar + Topbar + main)
│     └─ products/
│        ├─ page.tsx
│        ├─ new/page.tsx
│        └─ [id]/edit/page.tsx
├─ components/                  # UI & feature components
├─ redux/
│  ├─ store.ts                  # redux store config
│  ├─ hooks.ts                  # typed hooks (useAppDispatch/useAppSelector)
│  └─ features/
│     ├─ apiSlice.ts            # RTK Query base api (prepareHeaders)
│     ├─ productApi.ts          # product endpoints (getProducts, update, etc.)
│     └─ authSlice.ts           # simple auth state (token)
├─ types/
│  └─ product.ts                # Product & Category types
├─ lib/
│  └─ cloudinary.ts             # optional upload helper

\`\`\`

