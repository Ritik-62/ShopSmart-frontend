# 🛒 ShopSmart - Full-Stack E-Commerce Application

A modern, full-featured e-commerce platform built with React, Node.js, Express, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## ✨ Features

### For Customers
- 🔐 User authentication (signup/login with JWT)
- 🛍️ Browse products with search, filter, and sort
- 🛒 Shopping cart management
- 📦 Order placement and tracking
- 📱 Responsive design for all devices
- 🎨 Modern, intuitive UI

### For Admins
- 👨‍💼 Separate admin dashboard
- 📊 View all orders with pagination
- ✏️ Create, update, and delete products
- 🔄 Update order status (Pending/Completed/Cancelled)
- 📈 Sort and filter orders

### Technical Features
- ✅ Backend pagination and sorting
- ✅ Role-based access control (User/Admin)
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ RESTful API design
- ✅ Database relationships with Prisma ORM
- ✅ Error handling and validation

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.x - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** 5.x - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## 📁 Project Structure

```
ShopSmart/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── lib/           # API utilities
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── prisma/           # Database schema & client
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   └── package.json
│
├── POSTMAN_GUIDE.md      # API testing guide
├── API_ROUTES.md         # API documentation
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shopsmart.git
   cd ShopSmart
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create `.env` file in the `server` directory:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="your_secret_key_here"
   PORT=5001
   ```

5. **Set up the database**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

6. **Seed the database** (optional but recommended)
   ```bash
   npm run seed
   ```

7. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:5001`

   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173`

8. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 🔐 Environment Variables

### Server (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secret_key` |
| `PORT` | Server port number | `5001` |

---

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Endpoints Overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/login` | Public | Login user |
| GET | `/products` | Public | Get all products |
| GET | `/products/:id` | Public | Get single product |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| GET | `/cart` | User | Get user cart |
| POST | `/cart` | User | Add to cart |
| PUT | `/cart/:id` | User | Update cart item |
| DELETE | `/cart/:id` | User | Remove from cart |
| POST | `/orders` | User | Place order |
| GET | `/orders` | User | Get user orders |
| GET | `/orders/admin` | Admin | Get all orders |
| PUT | `/orders/:id/status` | Admin | Update order status |

For detailed API documentation with request/response examples, see [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)

### Deployed API Reference

**Base URL:** `https://shopsmart-api.onrender.com/api`

#### 1. Create (POST)

**Signup (User/Admin)**
- **Endpoint:** `/auth/signup`
- **Body (User):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Body (Admin):**
  ```json
  {
    "name": "Admin User",
    "email": "admin@shopsmart.com",
    "password": "admin123",
    "role": "ADMIN"
  }
  ```

**Create Product (Admin)**
- **Endpoint:** `/products`
- **Headers:** `Authorization: Bearer <ADMIN_TOKEN>`
- **Body:**
  ```json
  {
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 100,
    "imageUrl": "https://example.com/image.jpg"
  }
  ```

#### 2. Read (GET)

**Get All Products**
- **Endpoint:** `/products`
- **Query Params:** `?page=1&limit=10&sort=price,asc`

**Get User Cart**
- **Endpoint:** `/cart`
- **Headers:** `Authorization: Bearer <USER_TOKEN>`

#### 3. Update (PUT)

**Update Product (Admin)**
- **Endpoint:** `/products/:id`
- **Headers:** `Authorization: Bearer <ADMIN_TOKEN>`
- **Body:**
  ```json
  {
    "price": 89.99,
    "stock": 150
  }
  ```

**Update Cart Item Quantity**
- **Endpoint:** `/cart/:id`
- **Headers:** `Authorization: Bearer <USER_TOKEN>`
- **Body:**
  ```json
  {
    "quantity": 3
  }
  ```

#### 4. Delete (DELETE)

**Delete Product (Admin)**
- **Endpoint:** `/products/:id`
- **Headers:** `Authorization: Bearer <ADMIN_TOKEN>`

**Remove Item from Cart**
- **Endpoint:** `/cart/:id`
- **Headers:** `Authorization: Bearer <USER_TOKEN>`

---

## 🧪 Testing

### Using Postman

1. Import the API collection (see [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md))
2. Set up environment variables
3. Test all endpoints

### Pre-seeded Test Accounts

After running `npm run seed`:

**Admin Account:**
- Email: `admin@shopsmart.com`
- Password: `admin123`

**User Account:**
- Email: `user@example.com`
- Password: `user123`

### Manual Testing

1. **Sign up as a new user**
   - Go to `/signup`
   - Check "Sign up as Admin" for admin privileges

2. **Browse products**
   - Go to `/products`
   - Try search, filter, and sort

3. **Add to cart and checkout**
   - Add items to cart
   - Go to `/cart`
   - Proceed to checkout

4. **Admin dashboard** (admin only)
   - Go to `/admin`
   - Manage products and orders

---

## 📸 Screenshots

### Customer View
- **Home Page** - Welcome page with featured products
- **Products Page** - Browse with search, filter, and sort
- **Product Details** - Detailed product information
- **Cart** - Shopping cart management
- **My Orders** - Order history with status

### Admin View
- **Admin Dashboard** - Manage products and orders
- **Orders Tab** - View all orders with pagination and sorting
- **Products Tab** - Create, update, and delete products

---

## 🔑 Key Features Explained

### Pagination & Sorting
All pagination and sorting is handled by the backend for optimal performance:
- Products: 8 items per page
- Orders: 10 items per page
- Sort by price, date, amount, etc.

### Role-Based Access Control
- **Public routes:** Products listing, product details
- **User routes:** Cart, orders, checkout
- **Admin routes:** Product management, all orders, order status updates

### Security
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 30-day expiration
- Protected routes with authentication middleware
- Admin-only routes with role verification

---

## 📝 Database Schema

### Models
- **User** - User accounts (customers and admins)
- **Product** - Product catalog
- **CartItem** - Shopping cart items
- **Order** - Customer orders
- **OrderItem** - Items in each order

### Relationships
- User → CartItems (one-to-many)
- User → Orders (one-to-many)
- Product → CartItems (one-to-many)
- Product → OrderItems (one-to-many)
- Order → OrderItems (one-to-many)

---

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Order tracking
- [ ] Advanced analytics dashboard
- [ ] Product image upload
- [ ] Discount codes and coupons
- [ ] Multi-language support
- [ ] Dark mode

---

## 🐛 Troubleshooting

### Port 5000 Already in Use (macOS)
If you get a port conflict error, it's likely AirPlay Receiver. The app is configured to use port 5001 instead.

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Run `npx prisma db push` to sync schema

### CORS Errors
- Backend is configured for `http://localhost:5173`
- If using a different port, update `index.js` in server

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

## 📞 Support

For support, email your.email@example.com or open an issue in the repository.

---

