# Loopin Web

**Loopin** is a "Move-to-Earn" territorial conquest game built on the **Stacks Blockchain**. Players physically move in the real world to leave trails, close loops to capture territory, and compete for STX prizes. This repository contains the **Frontend Web Application**.

## 🚀 Features

* **Real-time Gameplay**: Visualizes player position, trails, and territories on a map using Leaflet.
* **Wallet Integration**: Connect with Xverse/Leather wallets via Stacks.js to manage identity and earnings.
* **Dashboard**: View game history, active sessions, leaderboard, and inventory.
* **Powerups**: Shop for and use in-game items like Shields and Cloaking devices.
* **Move-to-Earn**: Tracks geospatial data to award territory and crypto prizes.

## 🛠 Tech Stack

* **Framework**: React (Vite)
* **Language**: TypeScript
* **UI**: Tailwind CSS, shadcn/ui
* **Maps**: React Leaflet, OpenStreetMap
* **Blockchain**: Stacks.js, Clarigen
* **State**: React Hooks, Local Storage (Identity)

## 📦 Installation

1. **Clone the repository**:

    ```bash
    git clone <repo-url>
    cd loopin-web
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Setup Environment Variables**:
    Create a `.env` file in the root directory:

    ```bash
    VITE_API_BASE="http://localhost:8000/api"
    VITE_WS_URL="ws://localhost:8000/ws/game"
    ```

4. **Run the Development Server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🔗 Backend Integration

This frontend requires the `loopin-backend` service including:

* **blockchain-service**: Node.js/Supabase backend for game mechanics.
* **Supabase**: For database and real-time logic.

See [INTEGRATION.md](./INTEGRATION.md) for detailed instructions on connecting the frontend to the backend.

## 📂 Project Structure

* `src/pages`: Main views (GamePage, Dashboard, etc.)
* `src/components`: UI components (HUD, Map layers)
* `src/lib`: API clients and blockchain utilities.
* `src/data`: Mock data and configurations.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
