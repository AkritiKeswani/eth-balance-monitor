# eth-balance-monitor
ETH Balance Tracker App 
--------------------------

# ETH Balance Monitor

This project consists of two parts: a **backend** server and a **frontend** client. Both need to run simultaneously for the application to work correctly.

## Prerequisites

Before you start, ensure that you have the following installed on your system:

- **Node.js** (version 14.x or later)
- **npm** (Node Package Manager)

## Getting Started

### 1. Cloning the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/eth-balance-monitor.git
cd eth-balance-monitor
```

### 2. Setting Up the Backend

The backend is responsible for monitoring ETH balances and serving the data to the frontend.

#### Steps:

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm run dev
   ```

The backend server will now be running on `http://localhost:3000`.

### 3. Setting Up the Frontend

The frontend is responsible for displaying the ETH balance data retrieved from the backend.

#### Steps:

1. Open a new terminal tab or window.

2. Navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the frontend client:

   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3001`.

> **Note:** You may need to modify the ports or the API endpoint in the frontend configuration if the backend is running on a different port or address.

### 4. Running the Application

To successfully run the application, both the backend and frontend servers need to be running simultaneously:

- **Backend:** `http://localhost:3000`
- **Frontend:** `http://localhost:3001`

### 5. Accessing the Application

Once both servers are running:

- Open your browser and go to `http://localhost:3001` to access the frontend.
- The frontend will automatically fetch data from the backend and display the ETH balance information.

## Important Commands

- **Backend:**
  - Navigate to the `backend` directory: `cd backend`
  - Start the backend server: `npm run dev`
  
- **Frontend:**
  - Navigate to the `frontend` directory: `cd frontend`
  - Start the frontend client: `npm start`

---

### Troubleshooting

- Ensure that both the backend and frontend are running in separate terminal windows or tabs.
- If you're encountering CORS issues, double-check the configuration in both the backend and frontend.

---
