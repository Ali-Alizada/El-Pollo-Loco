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

    /**
     * Checks collisions between character and enemies (chickens/boss).
     * Uses helpers to handle jump‑kills and damage application.
     * @returns {void}
     */
    checkEnemyCollisions() {
        this.world.level.enemies.forEach(enemy => {
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
     * Uses a precise hitbox check via a helper.
     * @returns {void}
     */
    checkBottleCollisions() {
        this.world.level.bottles.forEach((bottle, idx) => {
            const char = this.world.character;
            if (this._isCollectibleCollision(char, bottle) && char.bottles < 5) {
                char.bottles++;
                this.world.statusBarBottle.setPercentage(char.bottles * 20);
                this.world.sound.play("bottle");
                this.world.level.bottles.splice(idx, 1);
            }
        });
    }

    /**
     * Checks if the character can collect a bottle using a custom, tighter hitbox.
     * @param {Character} character - The game character.
     * @param {Bottle} bottle - The bottle object.
     * @returns {boolean} True if character collides with bottle within the custom bounds.
     * @private
     */
    _isCollectibleCollision(character, bottle) {
        const charBox = {
            x: character.x + 20,
            y: character.y + 20,
            width: character.width - 40,
            height: character.height - 40
        };
        const bottleBox = {
            x: bottle.x + 15,
            y: bottle.y + 10,
            width: bottle.width - 30,
            height: bottle.height - 20
        };
        return (charBox.x < bottleBox.x + bottleBox.width &&
                charBox.x + charBox.width > bottleBox.x &&
                charBox.y < bottleBox.y + bottleBox.height &&
                charBox.y + charBox.height > bottleBox.y);
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