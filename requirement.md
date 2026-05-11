# 🚢 Import Export Hub — Project Requirements

## 🛠️ Tech Stack

### **Frontend**
- **React 19.2.0** — UI library for building interactive user interfaces
- **Vite 7.2.4** — Lightning-fast build tool and dev server
- **React Router 7.13.0** — Client-side routing for SPA navigation
- **Tailwind CSS 4.2.4** — Utility-first CSS framework
- **DaisyUI 5.5.14** — Component library built on Tailwind CSS

### **Backend & Database**
- **Firebase 12.12.1** — Backend-as-a-Service (Authentication & Firestore)
- **Firebase Auth** — Email/password and Google OAuth authentication

### **Animations & Effects**
- **Framer Motion 12.0.0** — React animation library for smooth transitions
- **React Fast Marquee 1.6.5** — Scrolling marquee component

### **Styling & Icons**
- **React Icons 5.5.0** — Popular icon library
- **@tailwindcss/vite 4.2.4** — Tailwind CSS Vite plugin
- **Autoprefixer 10.4.16** — Vendor prefix management

### **Notifications & UX**
- **React Toastify 11.0.5** — Toast notifications for user feedback

### **Utilities**
- **Date-fns 4.1.0** — Modern date utility library

---

## 🎨 Project Theme

**A modern web platform where users can manage exports, browse global products, and import any product into their personal "My Imports" section with one click. Clean UI, real-time sync, and secure user data.**

---

## 📋 Key Development Rules

- **GitHub Commits:**  
  - Minimum 15 notable client-side commits  
  - Minimum 8 notable server-side commits

- **Readme.md:** A meaningful `README.md` (client side) including:  
  - Website name  
  - Live site URL  
  - At least five bullet-point features

- **Content:** No Lorem Ipsum; do **not** use default alert for messages.  
  - All error/success messages via custom toast or UI

- **Deployment:**  
  - Choose Netlify, Surge, Firebase (client) or Vercel (server)  
  - Add custom domain for Firebase auth if using Netlify/Surge

- **SPA/Routes:**  
  - Application must not throw errors on route reloads  
  - Logged-in users must **not** be redirected to Login when reloading private routes

---

## 🧩 Main Functional Requirements

### 1. **Layout & Structure**
**Header:**  
- Logo + Navigation (left: All Products, My Exports, My Imports, Add Export)  
- Right: Login/Register button; after login, show Logout button and user’s image

**Footer:**  
- Copyright  
- Social links (using the new X logo, not the Twitter bird)  
- Contact info & additional details

---

### 2. **Home Page**
- Banner or slider
- Latest 6 Products: Fetched from DB, sorted by `createdAt: -1`, 3-column grid. Each card shows:
    1. Product Image
    2. Product Name
    3. Price
    4. Origin Country
    5. Rating
    6. Available Quantity
    7. “See Details” button  
    - “See Details” navigates to Product Details page
- Add 2 extra, unique homepage sections

---

### 3. **Authentication**
#### **Login:**
- Show login form (Title, Email, Password, Forget Password, Login button)
- On success: navigate to intended route or home
- On error: show error via toast/message
- Extras: Register page link, Google Login
- On Google login: sign in, navigate to intended route or home

#### **Registration:**
- Form fields: Name, Email, Photo URL, Password, Register button
- On success: navigate to intended route or home
- On error: show error (toast/message)
- **Password validation:**
    - Min. 6 chars
    - 1 uppercase, 1 lowercase letter (show error on fail)
- Extras: Login link, Google Login
- **Do not** implement email verification or forget password (may add later)

---

### 4. **Product Details Page**  *(Private Route)*
- Display all product details
- “Import Now” button opens modal; enter quantity → submit  
  - Quantity can **never** exceed available; disable "Submit" if so
  - On submit: database saves import, available decreases accordingly (use `$inc` operator)
- After importing, update available quantity

---

### 5. **All Products Page**
- Show all products (3-column grid), each card:
    1. Product Image
    2. Product Name
    3. Price
    4. Origin Country
    5. Rating
    6. Available Quantity
    7. “See Details” (navigates to details page)

---

### 6. **My Imports Page** *(Private Route)*
- All products imported by user via "Import Now"
- Each card:
    1. Product Image
    2. Product Name
    3. Price
    4. Rating
    5. Origin Country
    6. “Remove” button (removes from UI and DB)
    7. Imported Quantity
    8. “See Details” (navigates to details page)

---

### 7. **Add Export/Product Page** *(Private Route)*
- Form (fields: Name, Image URL, Price, Origin Country, Rating, Available Qty)
- “Add Export/Product” button: Saves to DB, appears on All Products page

---

### 8. **My Exports Page** *(Private Route)*
- All data added by user via Add Export
- Each card:
    1. Product Image
    2. Product Name
    3. Price
    4. Origin Country
    5. Rating
    6. Delete Button (DB & UI)
    7. Available Quantity
    8. Update Button (opens modal with prefilled form, submit updates in DB & on UI)

---

## 🎨 UI Design Requirements

- Unique design  
- Consistent heading style, spacing, and paragraph readability  
- Uniform image sizes; grid layouts with equal card heights/widths  
- Consistent button style (match home page)  
- Good spacing, alignment, and responsiveness for all devices  
- Navbar logo/heading styling consistent throughout  
- Use latest X logo for social (not Twitter bird)  
- Use grid layouts for uniformity  
- Leverage design inspiration (but not copy): ThemeForest, Uiverse, etc.

---

## 💡 Extra Functionalities / Challenges

- **All Products:** Add search by product name
- **Global:** Add dark/light mode toggle
- **Dynamic title:** Update page title dynamically

---

### Optional

- My Exports: Button to download all data as CSV
- User Roles: "exporter" and "importer"  
  - Only "exporters" can export  
  - Only "importers" can import

---

## 🧑‍💻 Resources

- [uiverse.io](https://uiverse.io/)  
- [devmeetsdevs.com](https://devmeetsdevs.com/)  
- [Free Images & Resources Collection](https://bootcamp.uxdesign.cc/free-images-and-resources-collection-for-website-c77f2fc46ce5)  
- [ThemeForest](https://themeforest.net/?srsltid=AfmBOopTj6PNz51iuV2YJXUtBP8nt19_zT5LG2dToAjIHQqzNCzregn0)  
- [CodeCanyon](https://codecanyon.net/?srsltid=AfmBOooRoUfeK7lOROpchCuA4hPVj5P9WRmtDQJ9K0E6Yhf4VTrHhXKt)

---

**End of Requirements**