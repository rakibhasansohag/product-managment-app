# Product Management App — Project Structure

This README describes the **project structure** and key files for the Product Management App (Next.js App Router + RTK Query).  
Copy & paste this `README.md` into your repository root.

---

## Quick start

```bash
# install deps
npm install

# dev
npm run dev

# build
npm run build

# start (production)
npm run start

Environment (create .env.local):

ini
NEXT_PUBLIC_API_URL=https://api.bitechx.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...

src/
├─ app/
│  ├─ layout.tsx                # root layout (fonts, global provider)
│  ├─ page.tsx                  # root page (redirect to /products)
│  ├─ error.tsx                 # optional global error boundary
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
└─ styles/
   └─ globals.css

