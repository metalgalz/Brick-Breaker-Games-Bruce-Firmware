# **🧱 Brick Breaker**

A classic arcade-style brick breaking game written in JavaScript. Control the paddle, deflect the ball, and destroy all bricks while collecting power-ups. Designed specifically for embedded devices.

This game is designed for low-resolution screens and is **recommended for use with Lilygo T-Embed** devices running **Bruce Firmware**.

## **⚡ Quick Installation (Beginner's Guide)**

Follow these 3 simple steps to start playing immediately:

1. **Prepare the File**: Save the game code as brickbreaker.js on your computer.  
2. **Upload**:  
   * Connect your T-Embed to WiFi (or its Hotspot) to access the **Bruce Web Interface**.  
   * Go to **File Manager**.  
   * Open the /apps folder.  
   * Upload brickbreaker.js there.  
3. **Play**:  
   * On your T-Embed screen, open the main menu.  
   * Go to **Files** or **Launcher**.  
   * Select brickbreaker.js to start the game\!

## **🎮 Features**

* **Power-Up System**:  
  * **Multiball (Yellow)**: Spawns two additional balls to create chaos and clear bricks faster.  
  * **Wide Paddle (Cyan)**: Expands your paddle size significantly, making it easier to catch the ball.  
* **Physics-Based Deflection**: The angle of the ball changes depending on where it hits the paddle, allowing for skilled shots.  
* **Dynamic Gameplay**:  
  * **Score Tracking**: Points awarded for every brick destroyed.  
  * **Win/Loss States**: Clear all bricks to win, or lose if all balls drop below the screen.  
* **Visual & Audio Feedback**:  
  * Color-coded elements (Red Ball, Green Paddle, White Bricks).  
  * Distinct sound effects for bouncing, breaking bricks, collecting power-ups, and game over.  
* **Responsive Controls**: Optimized for rotary inputs to move the paddle smoothly across the screen.

## **🛠️ Hardware & Software Prerequisites**

This game was developed and tested in the following environment:

* **Device**: Lilygo T-Embed (Recommended)  
* **Firmware**: Bruce Firmware (supports standard display, keyboard, audio modules)

### **Display & Input Specifications**

The game automatically scales the paddle and brick layout based on the screen dimensions (display.width()). Input uses the rotary encoder for precise horizontal movement.

## **🕹️ Controls (Lilygo T-Embed)**

| Button / Input | Menu Function | In-Game Function |
| :---- | :---- | :---- |
| **Dial Left / Prev** | Move Paddle Left | **Move Paddle Left** |
| **Dial Right / Next** | Move Paddle Right | **Move Paddle Right** |
| **Dial Press (Select)** | Start Game / Restart | \- |
| **Button / Esc** | Exit Game | Pause / Exit |

*\> Pro Tip: Try to hit the ball with the edge of the paddle to send it flying at a sharp angle\!*

## **📂 Code Structure**

* **Game Objects**:  
  * spawnBall(): Manages the multiball array.  
  * resetBricks(): Generates the grid of destroyable blocks.  
  * updatePaddleSprite(): Dynamically redraws the paddle when the Wide Power-Up is active.  
* **Logic Core**:  
  * **Collision Detection**: Checks intersections between balls, the paddle, and bricks.  
  * **Power-Up Logic**: Randomly drops items (25% chance) when a brick is broken.  
* **Main Loop**:  
  * Handles input reading, physics updates, and rendering to the sprite buffer in real-time.

## **📜 License**

This project is open-source. Feel free to use and modify it according to your needs.

Made with ❤️ using JavaScript for the Bruce Firmware Community.

Github / Discord by : metalgalz

![alt text](https://github.com/metalgalz/Brick-Breaker-Games-Bruce-Firmware/blob/main/LILYGO%20T%20EMBED.jpg.jpeg?raw=true)
