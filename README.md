# FoodFlow - MERN Stack Food Ordering Application

FoodFlow is a modern, full-stack food ordering platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a seamless user experience for browsing restaurants, managing a shopping cart, and placing orders (Cash on Delivery).

![Home Page]
<img width="965" height="866" alt="image" src="https://github.com/user-attachments/assets/c785d0d9-1308-4e3e-8e3e-a03fa838ab8a" />


## 🚀 Technical Architecture

-   **Frontend**: React (Vite), TailwindCSS for styling, React Context for state management.
-   **Backend**: Node.js, Express.js REST API.
-   **Database**: MongoDB Atlas (Cloud) with Mongoose ODM.
-   **Authentication**: Custom JWT implementation with secure password hashing.

## ✨ Key Features

-   **User Authentication**: Secure Login/Signup with persistent sessions.
-   **Restaurant Exploration**: Browse diverse cuisines (Indian, Italian, Mexican, etc.) with rich imagery.
-   **Interactive Cart**:
    -   Persistent cart state (Guest -> Logged in user transition).
    -   Real-time total calculation.
-   **Checkout Flow**: Protected routes ensuring users are logged in before ordering.
-   **Order Management**:
    -   Cash On Delivery (COD) payment flow.
    -   Order success confirmation page.
    -   Order history view for users.
-   **Reviews & Ratings**: Users can leave star ratings and text reviews for restaurants.

## 📸 Screenshots

### Menu & Cart
![Menu Page]
<img width="1912" height="861" alt="image" src="https://github.com/user-attachments/assets/12cc05cf-71b7-4ebc-8812-ba60d5afda37" />

### Guest Checkout Flow
![Signup Success]
<img width="1919" height="865" alt="image" src="https://github.com/user-attachments/assets/c403524a-7d1f-41f6-ba53-e530a43fa633" />


## 🛠️ Installation & Setup

### Prerequisites
-   Node.js installed
-   MongoDB Atlas URI (or local MongoDB)

### 1. Clone the repository
```bash
git clone <repository-url>
cd FoodFlow
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Run the seed script to populate data:
```bash
node seed.js
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🤝 Contributing
1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
