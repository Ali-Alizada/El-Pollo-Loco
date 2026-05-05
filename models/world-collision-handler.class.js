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

    /**
     * Main collision check entry point. Delegates to specific collision handlers.
     * @returns {void}
     */
    checkCollisionsLogic() {
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowableCollisions();
        this.cleanupMarkedObjects();
    }

    /**
     * Checks collisions between character and enemies (chickens/boss).
     * Uses helpers to handle jump‑kills and damage application.
     * @returns {void}
     */
    checkEnemyCollisions() {
        this.world.level.enemies.forEach(enemy => {
            if (enemy.isDeadState) return; 
            const character = this.world.character;
            if (!character.isColliding(enemy)) return;
            if (this._handleJumpOnChicken(character, enemy)) return;
            this._applyCharacterHit(character);
        });
    }

    /**
     * Handles the case where the character jumps on a chicken enemy.
     * @param {Character} character - The game character.
     * @param {Chicken} enemy - The chicken enemy.
     * @returns {boolean} True if the jump kill was executed, false otherwise.
     * @private
     */
    _handleJumpOnChicken(character, enemy) {
        if (!(enemy instanceof Chicken) || !this.isJumpingOn(enemy)) return false;
        if (!character.hasKilledChicken) {
            enemy.die();
            character.hasKilledChicken = true;
            const fallSpeed = Math.abs(character.speedY);
            character.speedY = Math.min(20, Math.max(12, fallSpeed * 0.6));
            character.invincibleUntil = Date.now() + 200;
        }
        return true;
    }

    /**
     * Applies damage to the character if not invincible and not spawn‑protected.
     * @param {Character} character - The game character.
     * @returns {void}
     * @private
     */
    _applyCharacterHit(character) {
        if (Date.now() >= (character.invincibleUntil || 0) && !character.spawnProtected) {
            character.hit();
            this.world.statusBarHealth.setPercentage(character.energy);
            if (character.energy <= 0) this.setLoseState();
        }
    }

    /**
     * Sets game state to "dying" and plays game over sound.
     * @returns {void}
     */
    setLoseState() {
        this.world.gameState = "dying";
        this.world.stopAllSounds();
        if (!this.world.loseSoundPlayed) {
            setTimeout(() => this.world.sound.play("gameOver"), 100);
            this.world.loseSoundPlayed = true;
        }
    }

    /**
     * Collects coins on collision and updates the coin status bar.
     * @returns {void}
     */
    checkCoinCollisions() {
        this.world.level.coins.forEach((coin, idx) => {
            const character = this.world.character;
            if (character.isColliding(coin) && character.isAboveGround() && character.coins < 10) {
                character.coins++;
                this.world.statusBarCoin.setPercentage(character.coins * 10);
                this.world.sound.play("coin");
                this.world.level.coins.splice(idx, 1);
            }
        });
    }

    /**
     * Collects bottles (items) on collision and updates the bottle status bar.
     * @returns {void}
     */
    checkBottleCollisions() {
        this.world.level.bottles.forEach((bottle, idx) => {
            const char = this.world.character;
            if (char.isColliding(bottle) && char.bottles < 5) {
                char.bottles++;
                this.world.statusBarBottle.setPercentage(char.bottles * 20);
                this.world.sound.play("bottle");
                this.world.level.bottles.splice(idx, 1);
            }
        });
    }

    /**
     * Checks collisions between thrown bottles and the end boss.
     * @returns {void}
     */
    checkThrowableCollisions() {
        for (let i = 0; i < this.world.throwableObjects.length; i++) {
            const bottle = this.world.throwableObjects[i];
            if (this._checkAndHandleBossHit(bottle)) {
                this.world.throwableObjects.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * Checks if a bottle hits the boss, handles the hit and returns true if hit.
     * @param {ThrowableObject} bottle - The thrown bottle
     * @returns {boolean} True if the boss was hit
     * @private
     */
    _checkAndHandleBossHit(bottle) {
        for (let enemy of this.world.level.enemies) {
            if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
                this.handleBossHit(enemy, bottle);
                if (enemy.energy <= 0 && this.world.gameState === "running") {
                    this.world.stateManager.initiateWin();
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Handles a hit on the end boss: reduces energy, plays sounds, creates splash.
     * @param {Endboss} enemy - The boss enemy
     * @param {ThrowableObject} bottle - The thrown bottle
     * @returns {void}
     */
    handleBossHit(enemy, bottle) {
        enemy.hit();
        this.world.statusBarBoss.setPercentage(enemy.energy);
        this.world.sound.play("bossHit");
        this.world.sound.play("splash");
        this.world.splashObjects.push(new Splash(enemy.x + enemy.width / 5, enemy.y + enemy.height / 3));
        bottle.hitBoss = true;
    }

    /**
     * Removes all objects marked for deletion (bottles, splashes, defeated enemies).
     * @returns {void}
     */
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
        const char = this.world.character;
        if (char.speedY >= 0) return false;
        const foot = char.getFootHitbox();
        const e = enemy.getHitbox();
        const verticalHit = foot.y + foot.height >= e.y - 10 && foot.y <= e.y + e.height;
        const horizontalHit = foot.x < e.x + e.width && foot.x + foot.width > e.x;
        return verticalHit && horizontalHit;
    }

    /**
     * Kills all chickens near a hit enemy (e.g., bottle explosion).
     * @param {MoveableObject} hitEnemy - The hit enemy (reference point)
     * @returns {void}
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
     * @returns {void}
     */
    spawnBottle(x, y) {
        this.world.level.bottles.push(new Bottle(x, y));
    }
}