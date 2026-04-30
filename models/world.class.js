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
  lastThrowTime = 0;
  throwCooldown = 500;
  gameState = "running";
  statusBarHealth = new Statusbarhealth();
  statusBarBottle = new Statusbarbottle();
  statusBarCoin = new Statusbarcoin();
  statusBarBoss = new StatusBarBoss();
  throwableObjects = [];
  splashObjects = [];
  intervals = [];

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
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
    if (this.level && this.level.enemies) {
      this.level.enemies.forEach((enemy) => {
        if (enemy.stopIntervals) enemy.stopIntervals();
      });
    }
    if (this.character && this.character.stopIntervals) {
      this.character.stopIntervals();
    }

    const freshEnemies = [
      new Chicken(800),
      new Chicken(1050),
      new Chicken(1400),
      new Chicken(1750),
      new SmallChicken(850),
      new SmallChicken(1000),
      new SmallChicken(1300),
      new SmallChicken(1550),
      new SmallChicken(1800),
      new SmallChicken(2400),
      new SmallChicken(2800),
      new SmallChicken(2950),
      new Endboss(),
    ];

    const freshCoins = [];
    for (let i = 0; i < 10; i++) {
      freshCoins.push(
        new Coin(200 + Math.random() * 2000, 60 + Math.random() * 100),
      );
    }

    const freshBottles = [];
    for (let i = 0; i < 10; i++) {
      freshBottles.push(new Bottle(200 + Math.random() * 2000, 100));
    }

    this.level = new Level(
      freshEnemies,
      [...level1.clouds],
      [...level1.backgroundObjects],
      freshCoins,
      freshBottles,
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

    this.level.clouds.forEach((cloud) => {
      cloud.world = this;
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
      const now = Date.now();
      if (
        this.keyboard.D &&
        this.character.bottles > 0 &&
        now - this.lastThrowTime >= this.throwCooldown
      ) {
        this.lastThrowTime = now;
        this.character.resetIdleTimer();

        let bottle = new ThrowableObject(
          this.character.x + 50,
          this.character.y + 100,
          this.character.otherDirection ? "left" : "right",
        );
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.statusBarBottle.setPercentage(this.character.bottles * 20);
      }
    }, 200);
    this.intervals.push(throwInterval);
  }

  clearAllIntervals() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals = [];
    if (this.character && this.character.stopIntervals)
      this.character.stopIntervals();
    if (this.level && this.level.enemies) {
      this.level.enemies.forEach((enemy) => {
        if (enemy.stopIntervals) enemy.stopIntervals();
      });
    }
  }

  checkCollisionsLogic() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (
          enemy instanceof Chicken &&
          this.isJumpingOn(enemy) &&
          !this.character.hasKilledChicken
        ) {
          enemy.die();
          this.character.hasKilledChicken = true;
        } else if (
          Date.now() >= (this.character.invincibleUntil || 0) &&
          !this.character.spawnProtected
        ) {
          this.character.hit();
          // this.sound.play("hit");
          this.statusBarHealth.setPercentage(this.character.energy);
          if (this.character.energy <= 0) {
            this.gameState = "dying";
            this.stopAllSounds();
            if (!this.loseSoundPlayed) {
              setTimeout(() => this.sound.play("gameOver"), 100);
              this.loseSoundPlayed = true;
            }
          }
        }
      }
    });

    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        if (this.character.coins < 10) {
          this.character.coins++;
          let percent = Math.min(this.character.coins * 20, 100);
          this.statusBarCoin.setPercentage(percent);
          this.sound.play("coin");
          this.level.coins.splice(index, 1);
        }
      }
    });

    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        if (this.character.bottles < 5) {
          this.character.bottles++;
          let percent = Math.min(this.character.bottles * 20, 100);
          this.statusBarBottle.setPercentage(percent);
          this.sound.play("bottle");
          this.level.bottles.splice(index, 1);
        }
      }
    });

    this.throwableObjects.forEach((bottle, bIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
          enemy.hit();
          this.statusBarBoss.setPercentage(enemy.energy);
          bottle.hitBoss = true;
          let splash = new Splash(
            enemy.x + enemy.width / 15,
            enemy.y + enemy.height / 3,
          );
          this.splashObjects.push(splash);
          this.sound.play("splash");
          this.sound.play("bossHit");
          this.throwableObjects.splice(bIndex, 1);

          if (enemy.energy <= 0) {
            this.gameState = "win";
            this.stopAllSounds();
            if (!this.winSoundPlayed) {
              this.sound.play("win");
              this.winSoundPlayed = true;
            }
            this.clearAllIntervals();
            return;
          }
        }
      });
      if (this.gameState === "win") return;
    });

    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.markedForDeletion,
    );
    this.splashObjects = this.splashObjects.filter((s) => !s.finished);
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForDeletion);
  }

  isJumpingOn(enemy) {
    if (this.character.speedY >= 0) return false;
    const characterBottom = this.character.y + this.character.height;
    const chickenTop = enemy.y;
    const isTouchingFromAbove =
      characterBottom >= chickenTop - 5 && characterBottom <= chickenTop + 30;

    if (!isTouchingFromAbove) return false;

    const characterLeft = this.character.x;
    const characterRight = this.character.x + this.character.width;
    const enemyLeft = enemy.x;
    const enemyRight = enemy.x + enemy.width;

    const overlap =
      Math.min(characterRight, enemyRight) - Math.max(characterLeft, enemyLeft);
    return overlap > 20;
  }

  killNearbyChickens(hitEnemy) {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken && Math.abs(enemy.x - hitEnemy.x) < 80) {
        enemy.die();
      }
    });
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

  initClickEvents() {}

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
    setTimeout(() => (this.character.spawnProtected = false), 2000);

    this.statusBarHealth = new Statusbarhealth();
    this.statusBarCoin = new Statusbarcoin();
    this.statusBarBottle = new Statusbarbottle();
    this.statusBarBoss = new StatusBarBoss();
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

    if (this.gameState === "running" || this.gameState === "dying") {
      this.drawGameObjects();
      showScreen(null);
    }
    if (this.gameState === "start") showScreen("startScreen");
    if (this.gameState === "win") showScreen("winScreen");
    if (this.gameState === "lose") showScreen("loseScreen");

    requestAnimationFrame(() => this.draw());
  }

  drawGameObjects() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarBoss);

    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.splashObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  addObjectsToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
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
