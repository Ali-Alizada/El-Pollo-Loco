🐔 El Pollo Loco
<p align="center"> <img src="img/9_intro_outro_screens/start/startscreen_2.png" width="720" alt="El Pollo Loco Start Screen"> </p> <p align="center"> <strong>A 2D browser game built with Object-Oriented JavaScript and the HTML5 Canvas API</strong> </p> <p align="center"> <a href="#">🎮 Play Live</a> • <a href="#features">✨ Features</a> • <a href="#architecture">🧱 Architecture</a> • <a href="#getting-started">🚀 Setup</a> </p>
🎮 Game Overview

El Pollo Loco is a fast-paced 2D side-scrolling action game where players
fight enemies, collect resources, and defeat a final boss.

Built completely from scratch using vanilla JavaScript, the project focuses on:

Clean object-oriented architecture
Real-time rendering & animation
High performance and responsiveness

No frameworks. No libraries. Just pure JavaScript.

✨ Features
🎯 Gameplay

Smooth character movement and jump physics
Enemy interactions with collision detection
Throwable weapons (bottles)
Boss fight with health system
Collectibles (coins & bottles)

🧠 Game Systems

Finite State Machine (start, running, win, lose)
Real-time collision engine
Full restart & reset logic
Object lifecycle management

🎨 User Interface

Dynamic UI overlay system
Animated start, win, and game-over screens
Interactive buttons with smooth transitions
Modal dialog system (blur + animation)
Responsive layout

🔊 Audio

Background music loop
Sound effects (hit, collect, boss, win/lose)
Mute toggle with dynamic icon

🖥️ Additional

Fullscreen mode
Asset preloading system (ImageManager)
Modular and scalable code structure

🧪 Live Demo

👉 Play the Game
(Add your GitHub Pages link here)

🎯 Controls

⬅️ ➡️ Move left / right
⬆️ / SPACE Jump
D Throw bottle

📸 Screenshots
🟡 Start Screen
<p align="center"> <img src="img/9_intro_outro_screens/start/startscreen_2.png" width="500"> </p>
🔴 Game Over
<p align="center"> <img src="img/You won, you lost/Game Over.png" width="500"> </p>
🟢 Victory
<p align="center"> <img src="img/You won, you lost/You won A.png" width="500"> </p>
🧱 Architecture

The game follows a modular, object-oriented design:

World
 ├── Character
 ├── Enemies
 │    ├── Chicken
 │    └── Endboss
 ├── Collectibles
 │    ├── Coins
 │    └── Bottles
 ├── Status Bars
 ├── Sound Manager
 └── Image Manager

Key Concepts

Game loop using requestAnimationFrame
State management for UI and gameplay
Entity-based architecture
Separation of concerns (UI vs Game Logic)

🛠 Tech Stack

HTML5 Canvas → Rendering engine
JavaScript (ES6) → Game logic (OOP)
CSS3 → UI & animations

🚀 Getting Started
1. Clone the repository
git clone https://github.com/your-username/el-pollo-loco.git

2. Run locally

Use a local development server:

Right-click index.html → Open with Live Server

⚠️ Running via file:// may cause asset loading issues

⚠️ Important Notes

Audio playback requires user interaction (browser policy)
All assets must be served via a local server

🧠 What This Project Demonstrates

Structuring large JavaScript applications
Real-time rendering and animation systems
Interactive UI development
Game state management
Debugging performance-critical logic

🔮 Future Improvements

📱 Mobile / touch controls
🧠 Advanced enemy AI
🌍 Multiple levels
💾 Save & load system
🏆 Leaderboard

📜 Privacy Policy

No personal data collected
No cookies
No tracking

Runs entirely in your browser

👨‍💻 Author

Developed as a portfolio project with focus on:

Clean architecture
Gameplay systems
Performance

⭐ Support

If you like this project:

⭐ Star the repository
🍴 Fork it
🛠 Contribute improvements

🔥 Why this version is better
No “GitHub bullet clutter”
Clean spacing like real game docs
Easy to scan in 5 seconds
Looks like actual game studio documentation
