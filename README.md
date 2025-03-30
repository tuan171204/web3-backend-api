# FE Internship API

## 🚀 Overview
This project is a **Node.js REST API** built with **Express, TypeScript, MongoDB (Atlas), and JWT authentication**. It supports:
- Authentication
- Profile Management
- Token Management

---

## 📦 Installation
### **1. Requirements**
```
Node.js v22.11.0+
```

### **2. Install dependencies**
```sh
yarn install
```

### **3. Create `.env` file**
Create a `.env` file in the root directory:
```
PORT=5035
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority&appName=<appName>
JWT_SECRET=S3CR3T_K3Y
JWT_EXPIRES_IN=1d
```

### **4. Start the server**
#### **Development mode**
```sh
yarn dev
```
Server will run at:
```
http://localhost:5035
```

---

## 🔑 Authentication
### **1. User Sign-up**
```http
POST /api/users/sign-up
Content-Type: application/json
```
#### **Request Body**
```json
{
  "walletAddress": "0x.....",
  "password": "123456"
}
```
✅ **Response:**
```json
{
  "message": "User registered successfully."
}
```

### **2. User Sign-in**
```http
POST /api/users/sign-in
Content-Type: application/json
```
#### **Request Body**
```json
{
  "walletAddress": "0x",
  "password": "123456"
}
```
✅ **Response:**
```json
{
  "message": "Login successfully.",
  "data": "eyJhbGciOi..."
}
```

### **3. User Profile**
```http
GET /api/users/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```
✅ **Response:**
```json
{
  "message": "Profile retrieved.",
  "data": {
    "walletAddress": "0x....",
    ....
  }
}
```

### **4. Update User Profile**
```http
PUT /api/users/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```
#### **Request Body**
```json
{
  "bio": "Lorem",
  "telegramUrl": "https://...",
  "xUrl": "https://...",
  "githubUrl": "https://...",
  "username": "..."
}
```

✅ **Response:**
```json
{
  "message": "Profile updated successfully.",
  "data": {
    "walletAddress": "0x....",
    ....
  }
}
```

---

## 🎯 Token Management
### **1. Create Token**
```http
POST /api/tokens/
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```
#### **Request Body**
- `image`: Upload an image file
- `name`: `MyToken`
- `symbol`: `MTK`
- `decimals`: `18`
- `supply`: `1000000`
- `description`: `This is a test token.`

✅ **Response:**
```json
{
  "message": "Token created successfully.",
  "data": { "name": "MyToken", "symbol": "MTK", ... }
}
```

### **2. Get Token by ID**
```http
GET /api/tokens/:id
```
✅ **Response:**
```json
{
  "message": "Token detail retrieved.",
  "data": {
      "name": "MyToken",
      "symbol": "MTK",
      "image": "uploads/1712345678900.png",
      ...
  }
 
}
```

### **3. Get All Tokens (Pagination)**
```http
GET /api/tokens?page=1&limit=10
```
✅ **Response:**
```json
{
  "message": "Tokens retrieved.",
  "data": [{ "name": "MyToken" }],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

### **4. Get All Tokens By User (Pagination)**
```http
GET /api/tokens/user?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```
✅ **Response:**
```json
{
  "message": "Tokens retrieved.",
  "data": [{ "name": "MyToken" }],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

---

