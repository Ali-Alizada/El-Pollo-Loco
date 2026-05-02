/**
 * Handles all collision detection and interactions between game objects.
 */
class WorldCollisionHandler {
    /**
     * @param {World} world - The World instance
     */
    constructor(world) {
        this.world = world;
    }

    /** Main collision check entry point. */
    checkCollisionsLogic() {
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowableCollisions();
        this.cleanupMarkedObjects();
    }

    /** Checks collisions between character and enemies (chickens/boss). */
    checkEnemyCollisions() {
        this.world.level.enemies.forEach(enemy => {
            if (!this.world.character.isColliding(enemy)) return;
            if (enemy instanceof Chicken && this.isJumpingOn(enemy) && !this.world.character.hasKilledChicken) {
                enemy.die();
                this.world.character.hasKilledChicken = true;
            } else if (Date.now() >= (this.world.character.invincibleUntil || 0) && !this.world.character.spawnProtected) {
                this.world.character.hit();
                this.world.statusBarHealth.setPercentage(this.world.character.energy);
                if (this.world.character.energy <= 0) this.setLoseState();
            }
        });
    }

    /** Sets game state to "dying" and plays game over sound. */
    setLoseState() {
        this.world.gameState = "dying";
        this.world.stopAllSounds();
        if (!this.world.loseSoundPlayed) {
            setTimeout(() => this.world.sound.play("gameOver"), 100);
            this.world.loseSoundPlayed = true;
        }
    }

    /** Collects coins on collision and updates the coin status bar. */
    checkCoinCollisions() {
        this.world.level.coins.forEach((coin, idx) => {
            if (this.world.character.isColliding(coin) && this.world.character.coins < 10) {
                this.world.character.coins++;
                this.world.statusBarCoin.setPercentage(this.world.character.coins * 10);
                this.world.sound.play("coin");
                this.world.level.coins.splice(idx, 1);
            }
        });
    }

    /** Collects bottles (items) on collision and updates the bottle status bar. */
    checkBottleCollisions() {
        this.world.level.bottles.forEach((bottle, idx) => {
            if (this.world.character.isColliding(bottle) && this.world.character.bottles < 5) {
                this.world.character.bottles++;
                this.world.statusBarBottle.setPercentage(this.world.character.bottles * 20);
                this.world.sound.play("bottle");
                this.world.level.bottles.splice(idx, 1);
            }
        });
    }

    /** Checks collisions between thrown bottles and the end boss. */
    checkThrowableCollisions() {
        for (let i = 0; i < this.world.throwableObjects.length; i++) {
            const bottle = this.world.throwableObjects[i];
            let hitBoss = false;
            for (let enemy of this.world.level.enemies) {
                if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
                    this.handleBossHit(enemy, bottle);
                    hitBoss = true;
                    break;
                }
            }
            if (hitBoss) {
                this.world.throwableObjects.splice(i, 1);
                i--;
            }
        }
        if (this.world.boss?.energy <= 0 && this.world.gameState !== "win") this.setWinState();
    }

    /**
     * Handles a hit on the end boss: reduces energy, plays sounds, creates splash.
     * @param {Endboss} enemy - The boss enemy
     * @param {ThrowableObject} bottle - The thrown bottle
     */
    handleBossHit(enemy, bottle) {
        enemy.hit();
        this.world.statusBarBoss.setPercentage(enemy.energy);
        this.world.sound.play("bossHit");
        this.world.sound.play("splash");
        this.world.splashObjects.push(new Splash(enemy.x + enemy.width / 15, enemy.y + enemy.height / 3));
        bottle.hitBoss = true;
    }

    /** Sets game state to "win" and plays victory sound. */
    setWinState() {
        this.world.gameState = "win";
        this.world.stopAllSounds();
        if (!this.world.winSoundPlayed) {
            this.world.sound.play("win");
            this.world.winSoundPlayed = true;
        }
        this.world.clearAllIntervals();
    }

    /** Removes all objects marked for deletion (bottles, splashes, defeated enemies). */
    cleanupMarkedObjects() {
        this.world.throwableObjects = this.world.throwableObjects.filter(b => !b.markedForDeletion);
        this.world.splashObjects = this.world.splashObjects.filter(s => !s.finished);
        this.world.level.enemies = this.world.level.enemies.filter(e => !e.markedForDeletion);
    }

    /**
     * Checks if the character lands on an enemy from above (jump attack).
     * @param {MoveableObject} enemy - The enemy (Chicken/SmallChicken)
     * @returns {boolean} true if landing on enemy successfully
     */
    isJumpingOn(enemy) {
        if (this.world.character.speedY >= 0) return false;
        const char = this.world.character;
        const charBottom = char.y + char.height;
        const touching = charBottom >= enemy.y - 5 && charBottom <= enemy.y + 30;
        if (!touching) return false;
        const overlap = Math.min(char.x + char.width, enemy.x + enemy.width) - Math.max(char.x, enemy.x);
        return overlap > 20;
    }

    /**
     * Kills all chickens near a hit enemy (e.g., bottle explosion).
     * @param {MoveableObject} hitEnemy - The hit enemy (reference point)
     */
    killNearbyChickens(hitEnemy) {
        this.world.level.enemies.forEach(enemy => {
            if (enemy instanceof Chicken && Math.abs(enemy.x - hitEnemy.x) < 80) enemy.die();
        });
    }

    /**
     * Spawns a new bottle at a given position (e.g., when a small chicken dies).
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    spawnBottle(x, y) {
        this.world.level.bottles.push(new Bottle(x, y));
    }
}