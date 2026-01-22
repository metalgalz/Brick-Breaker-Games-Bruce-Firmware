var display = require('display');
var keyboard = require('keyboard');
var audio = require('audio');

function main() {
  // --- SETUP DISPLAY ---
  var displayWidth = display.width();
  var displayHeight = display.height();
  var black = display.color(0, 0, 0);
  var white = display.color(255, 255, 255);
  var colorPaddle = display.color(50, 255, 50);
  var colorBall = display.color(255, 50, 50);
  var colorBrick = display.color(255, 255, 255);
  
  // Warna Power Ups
  var colorPowerUpMulti = display.color(255, 255, 0);   // Kuning (Multiball)
  var colorPowerUpWide = display.color(0, 255, 255);    // Cyan (Wide Paddle)

  // --- HELPER: Membuat data Bitmap Solid ---
  function createSolidData(w, h) {
    var bytesPerRow = Math.floor((w + 7) / 8);
    var size = bytesPerRow * h;
    var data = new Uint8Array(size);
    for (var i = 0; i < size; i++) {
      data[i] = 0xFF;
    }
    return data;
  }

  // --- OBJEK GAME ---
  
  // 1. Paddle
  // MODIFIKASI: Memperlebar ukuran paddle awal agar lebih mudah
  var paddleWidthOriginal = 48; 
  var paddleWidth = paddleWidthOriginal;
  var paddleHeight = 5;
  var paddleX = (displayWidth - paddleWidth) / 2;
  var paddleY = displayHeight - 10;
  var paddleSpeed = 8;
  var paddleSprite = createSolidData(paddleWidth, paddleHeight);

  // Fungsi untuk update gambar paddle jika ukurannya berubah
  function updatePaddleSprite() {
    paddleSprite = createSolidData(paddleWidth, paddleHeight);
  }

  // 2. Bola (Multiball Array)
  var ballSize = 4;
  var ballSprite = createSolidData(ballSize, ballSize);
  var balls = []; 

  function spawnBall(x, y, dx, dy) {
    balls.push({ x: x, y: y, dx: dx, dy: dy });
  }

  // 3. Power Ups
  var powerUpSize = 6;
  var powerUpSprite = createSolidData(powerUpSize, powerUpSize);
  var powerUps = []; // {x, y, type} -> type 0 = Multi, 1 = Wide

  // 4. Batu Bata
  var rows = 4;
  var cols = 6;
  var brickPadding = 4;
  var brickWidth = Math.floor((displayWidth - ((cols + 1) * brickPadding)) / cols);
  var brickHeight = 8;
  var bricks = [];
  var brickSprite = createSolidData(brickWidth, brickHeight);

  function resetBricks() {
    bricks = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var bx = brickPadding + (c * (brickWidth + brickPadding));
        var by = brickPadding + (r * (brickHeight + brickPadding));
        bricks.push({ x: bx, y: by, status: 1 });
      }
    }
  }
  resetBricks();

  // --- INISIALISASI ---
  var sprite = display.createSprite();
  keyboard.setLongPress(true);

  var score = 0;
  var gameRunning = false;
  var isGameOver = false;
  var isWin = false;

  // --- GAME LOOP ---
  while (true) {
    // === 1. INPUT ===
    if (keyboard.getEscPress(true)) {
      break; 
    }

    var moveLeft = keyboard.getPrevPress(true);
    var moveRight = keyboard.getNextPress(true);
    var btnOk = keyboard.getSelPress(true);

    // === 2. LOGIKA UTAMA ===

    // Jika Game Belum Jalan
    if (!gameRunning) {
        sprite.fill(black);
        sprite.setTextColor(white);
        sprite.setTextSize(1);
        sprite.setTextAlign(1); // Center

        if (isGameOver) {
            sprite.drawText("GAME OVER", (displayWidth/2)-30, (displayHeight/2)-10);
            sprite.drawText("Score: " + score, (displayWidth/2)-25, (displayHeight/2)+5);
            if (btnOk) {
                isGameOver = false;
                score = 0;
                resetBricks();
                balls = [];
                powerUps = [];
                
                // Reset Paddle ke ukuran asli
                paddleWidth = paddleWidthOriginal;
                updatePaddleSprite();
                
                gameRunning = true;
                spawnBall(paddleX + paddleWidth/2, paddleY - 10, 3, -3);
            }
        } else if (isWin) {
            sprite.drawText("YOU WIN!", (displayWidth/2)-25, (displayHeight/2)-10);
            if (btnOk) {
                isWin = false;
                score = 0;
                resetBricks();
                balls = [];
                powerUps = [];
                
                // Reset Paddle ke ukuran asli
                paddleWidth = paddleWidthOriginal;
                updatePaddleSprite();
                
                gameRunning = true;
            }
        } else {
            // Menu Awal
            sprite.drawText("BRICK GAME", (displayWidth/2)-30, (displayHeight/2)-10);
            sprite.drawText("Press OK", (displayWidth/2)-25, (displayHeight/2)+10);
            
            // Interaksi Paddle di Menu
            if (moveLeft) paddleX -= paddleSpeed;
            if (moveRight) paddleX += paddleSpeed;
            if (paddleX < 0) paddleX = 0;
            if (paddleX + paddleWidth > displayWidth) paddleX = displayWidth - paddleWidth;

            sprite.drawXBitmap(Math.floor(paddleX), Math.floor(paddleY), paddleSprite, paddleWidth, paddleHeight, colorPaddle);
            
            if (btnOk) {
                gameRunning = true;
                balls = []; 
                powerUps = []; 
                paddleWidth = paddleWidthOriginal; // Reset lebar
                updatePaddleSprite();
                
                spawnBall(paddleX + paddleWidth/2, paddleY - 10, 3, -3);
                audio.tone(600, 100);
            }
        }
        sprite.pushSprite();
        delay(20);
        continue;
    }

    // --- GAMEPLAY ---

    // 1. Gerak Paddle
    if (moveLeft) paddleX -= paddleSpeed;
    if (moveRight) paddleX += paddleSpeed;
    
    if (paddleX < 0) paddleX = 0;
    if (paddleX + paddleWidth > displayWidth) paddleX = displayWidth - paddleWidth;

    // 2. Update Power Ups
    for (var i = powerUps.length - 1; i >= 0; i--) {
        var p = powerUps[i];
        p.y += 2; // Power up jatuh

        // Cek tabrakan dengan Paddle
        if (p.y + powerUpSize >= paddleY &&
            p.y <= paddleY + paddleHeight &&
            p.x + powerUpSize >= paddleX &&
            p.x <= paddleX + paddleWidth) {
                
            // EFEK POWER UP BERDASARKAN TIPE
            if (p.type === 0) {
                // TIPE 0: MULTIBALL (Kuning)
                spawnBall(paddleX + paddleWidth/2, paddleY - 10, -2, -4);
                spawnBall(paddleX + paddleWidth/2, paddleY - 10, 2, -4);
                audio.tone(1200, 50); 
                delay(50); 
                audio.tone(1500, 100);
            } else if (p.type === 1) {
                // TIPE 1: WIDE PADDLE (Cyan)
                // MODIFIKASI: Menambah lebar lebih banyak (+24 pixel)
                paddleWidth += 24; 
                // Batasi agar tidak terlalu lebar sampai error
                if (paddleWidth > displayWidth - 10) paddleWidth = displayWidth - 10;
                
                // Update gambar paddle
                updatePaddleSprite();
                
                // Suara khusus powerup wide
                audio.tone(1000, 50);
                delay(50);
                audio.tone(800, 100);
            }
            
            powerUps.splice(i, 1); // Hapus power up
        } 
        else if (p.y > displayHeight) {
            powerUps.splice(i, 1);
        }
    }

    // 3. Update Semua Bola
    for (var i = balls.length - 1; i >= 0; i--) {
        var b = balls[i];

        // Gerak
        b.x += b.dx;
        b.y += b.dy;

        // Pantul Dinding
        if (b.x <= 0 || b.x + ballSize >= displayWidth) {
            b.dx = -b.dx;
            audio.tone(400, 20);
        }
        if (b.y <= 0) {
            b.dy = -b.dy;
            audio.tone(400, 20);
        }

        // Pantul Paddle
        if (b.y + ballSize >= paddleY && 
            b.y <= paddleY + paddleHeight &&
            b.x + ballSize >= paddleX && 
            b.x <= paddleX + paddleWidth) {
                
            b.dy = -Math.abs(b.dy);
            var centerP = paddleX + paddleWidth/2;
            var centerB = b.x + ballSize/2;
            // Hitung sudut pantul berdasarkan posisi kena paddle
            b.dx = (centerB - centerP) * 0.35; 
            audio.tone(400, 20);
        }

        // Cek Bata
        for (var j = 0; j < bricks.length; j++) {
            var br = bricks[j];
            if (br.status === 1) {
                if (b.x < br.x + brickWidth &&
                    b.x + ballSize > br.x &&
                    b.y < br.y + brickHeight &&
                    b.y + ballSize > br.y) {
                        
                        br.status = 0;
                        b.dy = -b.dy;
                        score += 10;
                        audio.tone(800, 20);

                        // DROP POWER UP (Peluang 25%)
                        if (Math.random() < 0.25) {
                            // Random tipe: 0 (Multi) atau 1 (Wide)
                            var pType = Math.random() < 0.5 ? 0 : 1;
                            powerUps.push({ x: br.x + brickWidth/2, y: br.y, type: pType });
                        }
                }
            }
        }

        // Bola Mati
        if (b.y > displayHeight) {
            balls.splice(i, 1);
        }
    }

    // Cek Game Over
    if (balls.length === 0) {
        gameRunning = false;
        isGameOver = true;
        audio.tone(150, 500);
    }

    // Cek Menang
    var activeCount = 0;
    for (var i = 0; i < bricks.length; i++) {
        if (bricks[i].status === 1) activeCount++;
    }
    if (activeCount === 0) {
        gameRunning = false;
        isWin = true;
        audio.tone(1000, 200);
    }

    // === 3. GAMBAR (RENDERING) ===
    sprite.fill(black);

    // Paddle (gunakan paddleSprite yang dinamis)
    sprite.drawXBitmap(Math.floor(paddleX), Math.floor(paddleY), paddleSprite, paddleWidth, paddleHeight, colorPaddle);

    // Bola
    for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        sprite.drawXBitmap(Math.floor(b.x), Math.floor(b.y), ballSprite, ballSize, ballSize, colorBall);
    }

    // Power Ups
    for (var i = 0; i < powerUps.length; i++) {
        var p = powerUps[i];
        // Pilih warna berdasarkan tipe
        var pColor = (p.type === 1) ? colorPowerUpWide : colorPowerUpMulti;
        sprite.drawXBitmap(Math.floor(p.x), Math.floor(p.y), powerUpSprite, powerUpSize, powerUpSize, pColor);
    }

    // Bata
    for (var i = 0; i < bricks.length; i++) {
        var b = bricks[i];
        if (b.status === 1) {
            sprite.drawXBitmap(Math.floor(b.x), Math.floor(b.y), brickSprite, brickWidth, brickHeight, colorBrick);
        }
    }

    // Score
    sprite.setTextColor(white);
    sprite.drawText("" + score, 2, 2);

    sprite.pushSprite();
    delay(20);
  }
  
  keyboard.setLongPress(false);
}

main();