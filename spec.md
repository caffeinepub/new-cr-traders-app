# NEW CR TRADERS Grocery App

## Current State
New project - no existing code.

## Requested Changes (Diff)

### Add
- Customer auth: sign up (full name, email, phone, address, password) + sign in
- Terms & Conditions shown during sign up (must accept before proceeding)
- Home page with search bar, category grid, featured products
- Bottom navigation: Home, Cart, Orders, Buy Again, Settings
- Product catalog with categories: Dal, Masale, Meva, Rice, Pooja Items, and more
- Each product: name, size, packed/unpacked, description, image, price, add-to-cart button
- Cart with checkout flow
- Order confirmation screen (green success screen like real app)
- Orders list (sent to WhatsApp 9358251328)
- Settings page: profile (name, address, language), barcode (QR code linking to app), terms
- Delivery restricted to Aligarh, UP - show "Currently Unavailable" for outside addresses
- Admin dashboard (access via phone 9358251328 + PIN NCR9358)
  - Manage products (add/edit/delete): name, size, packed/unpacked, description, image, price, category
  - Manage categories
  - View all orders
  - Change prices
- AI chatbot assistant feature
- Shop info displayed: GSTIN 09BTFPK1482H1ZK, FSSAI 22727411000024
- Shop address: Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas, Aligarh 202001, UP
- Shop poem / about section
- WhatsApp order notification to 9358251328
- Multi-language support (10 Indian languages)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend actors: User, Product, Category, Order, Admin
2. Authorization for customer and admin roles
3. Blob storage for product images
4. Frontend: Auth flow, Home, Product listing, Cart, Orders, Settings, Admin dashboard
5. AI chatbot (rule-based, frontend only)
6. WhatsApp order link generation
7. QR code in settings
