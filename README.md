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
### **1. User Request**
```http
POST /api/users/request
Content-Type: application/json
```
#### **Request Body**
```json
{
  "walletAddress": "0x.....",
}
```
✅ **Response:**
```json
{
  "data": "....."
}
```

### **2. User Login**
```http
POST /api/users/login
Content-Type: application/json
```
#### **Request Body**
```json
{
  "walletAddress": "0x",
  "signature": "0x",
  "message": "...."
}
```
✅ **Response:**
```json
{
  "message": "Login successfully.",
  "data": "eyJhbGciOi..."
}
```
