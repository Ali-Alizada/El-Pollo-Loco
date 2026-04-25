class World {
  character = new Character();
  level = null;
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
  intervals = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.images = new ImageManager();
    this.sound = new SoundManager();
    this.gameState = "start";
    this.initClickEvents();
    this.loadFreshLevel();
    this.setWorld();
    this.draw();
    this.startGameLoops();
  }

  loadFreshLevel() {
    // Nur stoppen, wenn vorhanden
    if (this.level && this.level.enemies) {
      this.level.enemies.forEach(enemy => {
        if (enemy.stopIntervals) enemy.stopIntervals();
      });
    }
    if (this.character && this.character.stopIntervals) {
      this.character.stopIntervals();
    }

    // Frische Enemies
    const freshEnemies = [
      new Chicken(), new Chicken(), new Chicken(),
      new SmallChicken(), new SmallChicken(), new SmallChicken(),
      new SmallChicken(), new SmallChicken(), new SmallChicken(),
      new Endboss()
    ];

    const freshCoins = [];
    for (let i = 0; i < 20; i++) {
      freshCoins.push(new Coin(200 + Math.random() * 2000, 60 + Math.random() * 300));
    }

    const freshBottles = [];
    for (let i = 0; i < 20; i++) {
      freshBottles.push(new Bottle(200 + Math.random() * 2000, 330));
    }

    this.level = new Level(
      freshEnemies,
      [new Cloud()],
      [...level1.backgroundObjects],
      freshCoins,
      freshBottles
    );
    this.level.level_end_x = 2960;
  }

  setWorld() {
    this.character.world = this;
    if (this.character.stopIntervals) this.character.stopIntervals();
    this.character.animate();
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      if (enemy instanceof Endboss) {
        this.boss = enemy;
        if (enemy.stopIntervals) enemy.stopIntervals();
        enemy.animate();
      }
    });
  }

  startGameLoops() {
    this.clearAllIntervals();

    const collisionInterval = setInterval(() => {
      if (this.gameState !== "running") return;
      this.checkCollisionsLogic();
    }, 1000 / 15);
    this.intervals.push(collisionInterval);

    const throwInterval = setInterval(() => {
      if (this.gameState !== "running") return;
      if (this.keyboard.D && this.character.bottles > 0) {
        let bottle = new ThrowableObject(
          this.character.x + 50,
          this.character.y + 100,
          this.character.otherDirection ? "left" : "right"
        );
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.statusBarBottle.setPercentage(this.character.bottles * 20);
      }
    }, 200);
    this.intervals.push(throwInterval);
  }

  clearAllIntervals() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    if (this.character && this.character.stopIntervals) this.character.stopIntervals();
    if (this.level && this.level.enemies) {
      this.level.enemies.forEach(enemy => {
        if (enemy.stopIntervals) enemy.stopIntervals();
      });
    }
  }

  checkCollisionsLogic() {
    // Gegner-Kollision
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (enemy instanceof Chicken && this.isJumpingOn(enemy)) {
          this.killNearbyChickens(enemy);
        } else if (Date.now() >= (this.character.invincibleUntil || 0) && !this.character.spawnProtected) {
          this.character.hit();
          this.sound.play("hit");
          this.statusBarHealth.setPercentage(this.character.energy);
          if (this.character.energy <= 0) {
            this.gameState = "lose";
            this.stopAllSounds();
            if (!this.loseSoundPlayed) {
              setTimeout(() => this.sound.play("gameOver"), 100);
              this.loseSoundPlayed = true;
            }
          }
        }
      }
    });

    // Coins
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.coins++;
        let percent = Math.min(this.character.coins * 20, 100);
        this.statusBarCoin.setPercentage(percent);
        this.sound.play("coin");
        this.level.coins.splice(index, 1);
      }
    });

    // Flaschen
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.character.bottles++;
        let percent = Math.min(this.character.bottles * 20, 100);
        this.statusBarBottle.setPercentage(percent);
        this.sound.play("bottle");
        this.level.bottles.splice(index, 1);
      }
    });

    // Wurf gegen Endboss
    this.throwableObjects.forEach((bottle, bIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
          enemy.hit();
          this.statusBarBoss.setPercentage(enemy.energy);
          let splash = new Splash(enemy.x + enemy.width / 15, enemy.y + enemy.height / 3);
          this.splashObjects.push(splash);
          this.sound.play("splash");
          this.sound.play("bossHit");
          this.throwableObjects.splice(bIndex, 1);
          if (enemy.energy <= 0) {
            this.gameState = "win";
            this.stopAllSounds();
            if (!this.winSoundPlayed) {
              setTimeout(() => this.sound.play("win"), 100);
              this.winSoundPlayed = true;
            }
          }
        }
      });
    });

    this.splashObjects = this.splashObjects.filter(s => !s.finished);
    this.level.enemies = this.level.enemies.filter(e => !e.markedForDeletion);
  }

  isJumpingOn(enemy) {
    return this.character.speedY < 0 && this.character.y + this.character.height < enemy.y + 40;
  }

  killNearbyChickens(hitEnemy) {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken && Math.abs(enemy.x - hitEnemy.x) < 80) {
        enemy.die();
      }
    });
    setTimeout(() => this.character.speedY = 20, 50);
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
    // Platzhalter
  }

  handleClick(action) {
    if (action === "start") {
      this.gameState = "running";
      this.sound.loop("bgMusic");
      showScreen(null);
    }
    if (action === "restart") {
      this.performRestart();
    }
    if (action === "back") {
      this.resetToHome();
    }
    if (action === "sound") {
      this.sound.toggle();
      updateSoundIcon();
    }
    if (action === "fullscreen") {
      toggleFullscreen();
    }
  }

  resetToHome() {
    this.clearAllIntervals();
    this.stopAllSounds();
    this.gameState = "start";
    this.loseSoundPlayed = false;
    this.winSoundPlayed = false;
    this.throwableObjects = [];
    this.splashObjects = [];

    this.loadFreshLevel();

    this.character.energy = 100;
    this.character.coins = 0;
    this.character.bottles = 0;
    this.character.x = 120;
    this.character.y = 95;
    this.character.lastHitTime = 0;
    this.character.lastMoveTime = Date.now();
    this.character.invincibleUntil = 0;
    this.character.spawnProtected = true;
    setTimeout(() => this.character.spawnProtected = false, 2000);

    this.statusBarHealth.setPercentage(100);
    this.statusBarCoin.setPercentage(0);
    this.statusBarBottle.setPercentage(0);
    this.statusBarBoss.setPercentage(100);

    this.setWorld();
    this.startGameLoops();
    showScreen("startScreen");
  }

  performRestart() {
    this.resetToHome();
    this.gameState = "running";
    this.sound.loop("bgMusic");
    showScreen(null);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);

    if (this.gameState === "running") {
      this.drawGameObjects();
      showScreen(null);
    }
    if (this.gameState === 'start') showScreen("startScreen");
    if (this.gameState === 'win') showScreen("winScreen");
    if (this.gameState === 'lose') showScreen("loseScreen");

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

  addObjectsToMap(objects) {
    objects.forEach(obj => this.addToMap(obj));
  }

  addToMap(moveableObject) {
    if (moveableObject.visible === true) return;
    if (moveableObject.otherDirection) this.flipImage(moveableObject);
    moveableObject.draw(this.ctx);
    moveableObject.drawFrame(this.ctx);
    if (moveableObject.otherDirection) this.flipImageBack(moveableObject);
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