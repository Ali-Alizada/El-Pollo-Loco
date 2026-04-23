class World {
  // ... bestehende Eigenschaften ...
  privacyText =
    "El Pollo Loco - Privacy Policy\n\nWe do not collect any personal data.\nThis game runs entirely in your browser.\nNo cookies, no tracking, no data sharing.\n\n© 2024 El Pollo Loco Game";

  infoText =
    "El Pollo Loco - Game Info\n\nControls:\n- Arrow Keys: Move left/right\n- Space: Jump\n- D Key: Throw bottle\n\nObjective:\nCollect coins and bottles.\nDefeat enemies and the final boss!";

  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  images;
  loseSoundPlayed = false;
  winSoundPlayed = false;
  gameState = "running";
  statusBarHealth = new Statusbarhealth();
  statusBarBottle = new Statusbarbottle();
  statusBarCoin = new Statusbarcoin();
  statusBarBoss = new StatusBarBoss();
  throwableObjects = [];
  splashObjects = [];
  clickableObjects = [];
  intervals = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.images = new ImageManager();
    this.sound = new SoundManager();
    this.gameState = "start";
    this.initClickEvents();
    this.setWorld();
    this.draw();
    this.checkCollisions();
    this.checkThrowObjects();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      if (enemy instanceof Endboss) {
        this.boss = enemy;
        enemy.animate();
      }
    });
  }

  isJumpingOn(enemy) {
    return (
      this.character.speedY < 0 &&
      this.character.y + this.character.height < enemy.y + 40
    );
  }

  killNearbyChickens(hitEnemy) {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken) {
        if (enemy instanceof SmallChicken) {
          this.sound.play("chicken");
        }

        let distance = Math.abs(enemy.x - hitEnemy.x);

        if (distance < 80) {
          enemy.die();
        }
      }
    });

    setTimeout(() => {
      this.character.speedY = 20;
    }, 50);
  }

  spawnBottle(x, y) {
    let bottle = new Bottle(x, y);
    this.level.bottles.push(bottle);
  }

  stopAllSounds() {
    this.sound.stop("snoring");
    this.sound.stop("walking");
    this.sound.stop("bgMusic");
  }

  initClickEvents() {
    this.canvas.addEventListener("click", (e) => {
      let rect = this.canvas.getBoundingClientRect();
      let scaleX = this.canvas.width / rect.width;
      let scaleY = this.canvas.height / rect.height;

      let x = (e.clientX - rect.left) * scaleX;
      let y = (e.clientY - rect.top) * scaleY;

      for (let i = this.clickableObjects.length - 1; i >= 0; i--) {
        let btn = this.clickableObjects[i];

        if (x > btn.x && x < btn.x + btn.w && y > btn.y && y < btn.y + btn.h) {
          this.handleClick(btn.action);
          break;
        }
      }
    });
  }

  handleClick(action) {
    if (action === "start") {
      this.gameState = "running";
      this.sound.loop("bgMusic");
    }

    if (action === "restart") {
      this.performRestart();
    }

    if (action === "back") {
      this.gameState = "start";
      this.stopAllSounds();
    }

    if (action === "privacy") {
      this.gameState = "dialogPrivacy";
    }

    if (action === "info") {
      this.gameState = "dialogInfo";
    }

    if (action === "sound") {
      this.sound.toggle();
    }

    if (action === "fullscreen") {
      toggleFullscreen();
    }

    if (action === "close") {
      this.gameState = "start";
    }

    console.log("CLICKED:", action);
  }

  performRestart() {
    console.log("RESTART - wird ausgeführt");

    this.stopAllSounds();
    this.gameState = "running";
    this.character.energy = 100;
    this.character.coins = 0;
    this.character.bottles = 0;
    this.character.x = 120;
    this.character.y = 95;
    this.character.lastHitTime = 0;
    this.character.lastMoveTime = new Date().getTime();
    this.character.walkingSoundPlaying = false;
    this.character.snoringSoundPlaying = false;
    this.character.deadSoundPlayed = false;
    this.statusBarHealth.setPercentage(100);
    this.statusBarCoin.setPercentage(0);
    this.statusBarBottle.setPercentage(0);
    this.throwableObjects = [];
    this.splashObjects = [];
    this.level = level1();
    this.setWorld();

    if (this.boss) {
      this.boss.energy = 100;
      this.boss.x = 2900;
      this.boss.phase = 1;
      this.boss.speed = 2;
      this.boss.currentState = "walk";
      this.boss.markedForDeletion = false;
      this.statusBarBoss.setPercentage(100);
    }

    this.loseSoundPlayed = false;
    this.winSoundPlayed = false;
    this.sound.loop("bgMusic");

    console.log("RESTART - abgeschlossen");
  }

  checkCollisions() {
    setInterval(() => {
      if (this.gameState !== "running") return;

      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          if (enemy instanceof Chicken && this.isJumpingOn(enemy)) {
            this.killNearbyChickens(enemy);
          }

          if (this.character.energy <= 0) {
            this.gameState = "lose";
            this.stopAllSounds();
            if (!this.loseSoundPlayed) {
              setTimeout(() => {
                this.sound.play("gameOver");
              }, 100);

              this.loseSoundPlayed = true;
            }
          } else {
            this.character.hit();
            this.sound.play("hit");
            this.statusBarHealth.setPercentage(this.character.energy);
          }
        }
      });

      this.level.coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {
          this.character.coins++;

          let percent = this.character.coins * 20;
          percent = Math.min(percent, 100);

          this.statusBarCoin.setPercentage(percent);
          this.sound.play("coin");
          this.level.coins.splice(index, 1);
        }
      });

      this.level.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle)) {
          this.character.bottles++;

          let percent = this.character.bottles * 20;
          percent = Math.min(percent, 100);
          this.statusBarBottle.setPercentage(percent);
          this.sound.play("bottle");
          this.level.bottles.splice(index, 1);
        }
      });

      this.throwableObjects.forEach((bottle, bIndex) => {
        this.level.enemies.forEach((enemy) => {
          if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
            enemy.hit();

            if (enemy instanceof Endboss && enemy.energy <= 0) {
              this.gameState = "win";
              this.stopAllSounds();

              if (!this.winSoundPlayed) {
                setTimeout(() => {
                  this.sound.play("win");
                }, 100);

                this.winSoundPlayed = true;
              }
            }

            this.statusBarBoss.setPercentage(enemy.energy);
            let splash = new Splash(
              enemy.x + enemy.width / 15,
              enemy.y + enemy.height / 3,
            );

            this.splashObjects.push(splash);
            this.sound.play("splash");
            console.log("Boss hit!", enemy.energy);
            this.sound.play("bossHit");
            this.throwableObjects.splice(bIndex, 1);
          }
        });
      });

      this.splashObjects = this.splashObjects.filter((s) => !s.finished);
      this.level.enemies = this.level.enemies.filter(
        (e) => !e.markedForDeletion,
      );
    }, 1000 / 15);
  }

  checkThrowObjects() {
    setInterval(() => {
      if (this.gameState !== "running") return;

      if (this.keyboard.D && this.character.bottles > 0) {
        let bottle = new ThrowableObject(
          this.character.x + 50,
          this.character.y + 100,
          this.character.otherDirection ? "left" : "right",
        );

        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.statusBarBottle.setPercentage(this.character.bottles * 20);
      }
    }, 200);
  }

  draw() {
    this.clickableObjects = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);

    if (this.gameState === "running") {
      this.drawGameObjects();
    }

    if (this.gameState === "start") {
      this.drawStartScreen();
    }

    if (this.gameState === "win") {
      this.drawWinScreen();
    }

    if (this.gameState === "lose") {
      this.drawLoseScreen();
    }

    if (this.gameState === "dialogPrivacy") {
      this.drawDialog("Privacy Policy", this.privacyText);
    }

    if (this.gameState === "dialogInfo") {
      this.drawDialog("Game Info", this.infoText);
    }

    this.drawTopIcons();
    requestAnimationFrame(() => this.draw());
  }

  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.splashObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottle);

    if (this.character.x > 2000) {
      this.addToMap(this.statusBarBoss);
    }
  }

  drawText(text, x, y, action) {
    this.ctx.fillStyle = "white";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(text, x, y);

    this.clickableObjects.push({
      action,
      x,
      y: y - 20,
      w: 150,
      h: 30,
    });
  }

  drawStartScreen() {
    let img = this.images.get("start");

    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    this.drawButton("Start Game", 310, 50, 120, 46, "start");
    this.drawText("Privacy Policy", 26, this.canvas.height - 26, "privacy");
    this.drawText("Game Info", 150, this.canvas.height - 26, "info");
  }

  drawWinScreen() {
    this.drawOverlay();
    this.ctx.drawImage(this.images.get("win"), 150, 80, 500, 300);
    this.drawButton("Back to Home", 180, 400, 136, 46, "back");
    this.drawButton("Restart Game", 380, 400, 136, 46, "restart");
  }

  drawLoseScreen() {
    this.drawOverlay();
    this.ctx.drawImage(this.images.get("lose"), 150, 80, 500, 300);
    this.drawButton("Back to Home", 180, 400, 136, 46, "back");
    this.drawButton("Restart Game", 380, 400, 136, 46, "restart");
  }

  drawOverlay() {
    this.ctx.fillStyle = "rgba(0,0,0,0.1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawTopIcons() {
    let soundImg = this.sound.isMuted
      ? this.images.get("soundOff")
      : this.images.get("soundOn");
    let fullscreenImg = this.images.get("fullscreenIcon");
    this.ctx.drawImage(soundImg, this.canvas.width - 76, 20, 20, 20);
    this.clickableObjects.push({
      action: "sound",
      x: this.canvas.width - 76,
      y: 20,
      w: 20,
      h: 20,
    });

    this.ctx.drawImage(fullscreenImg, this.canvas.width - 40, 20, 20, 20);
    this.clickableObjects.push({
      action: "fullscreen",
      x: this.canvas.width - 40,
      y: 20,
      w: 20,
      h: 20,
    });
  }

  drawDialog(title, text) {
    this.drawOverlay();
    let x = 100;
    let y = 80;
    let w = this.canvas.width - 200;
    let h = this.canvas.height - 160;

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = "none";
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.fillStyle = "black";
    this.ctx.font = "bold 24px Arial";
    this.ctx.fillText(title, x + 20, y + 40);
    this.ctx.font = "16px Arial";
    const lines = text.split("\n");
    let lineY = y + 80;

    for (let line of lines) {
      if (line.trim() === "---") {
        lineY += 10;
        continue;
      }
      this.ctx.fillText(line, x + 20, lineY);
      lineY += 25;
    }

    this.drawButton("Close", x + w - 100, y + h - 56, 80, 46, "close");
  }

  drawButton(text, x, y, w, h, action) {
    this.ctx.fillStyle = "orange";
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.fillStyle = "black";
    this.ctx.font = "18px Arial";
    this.ctx.fillText(text, x + 16, y + 30);
    this.clickableObjects.push({ action, x, y, w, h });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(moveableObject) {
    if (moveableObject.visible === true) return;

    if (moveableObject.otherDirection) {
      this.flipImage(moveableObject);
    }
    moveableObject.draw(this.ctx);
    moveableObject.drawFrame(this.ctx);

    if (moveableObject.otherDirection) {
      this.flipImageBack(moveableObject);
    }
  }

  flipImage(moveableObject) {
    this.ctx.save();
    this.ctx.translate(moveableObject.width, 0);
    this.ctx.scale(-1, 1);
    moveableObject.x = moveableObject.x * -1;
  }

  flipImageBack(moveableObject) {
    moveableObject.x = moveableObject.x * -1;
    this.ctx.restore();
  }
}
