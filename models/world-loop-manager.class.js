/**
 * Manages the game loops (intervals for collisions and throwing).
 */
class WorldLoopManager {
    /**
     * @param {World} world - The World instance
     */
    constructor(world) {
        this.world = world;
    }

    /** Starts all necessary intervals (collision, throw cooldown). */
    startGameLoops() {
        this.clearAllIntervals();
        this.world.intervals.push(setInterval(() => {
            if (this.world.gameState !== "running") return;
            this.world.collisionHandler.checkCollisionsLogic();
        }, 1000 / 15));
        this.world.intervals.push(setInterval(() => this.checkThrow(), 200));
    }

    /** Checks if the player wants to throw a bottle (D key). */
    checkThrow() {
        if (this.world.gameState !== "running") return;
        const now = Date.now();
        if (this.world.keyboard.D && this.world.character.bottles > 0 &&
            now - this.world.lastThrowTime >= this.world.throwCooldown) {
            this.throwBottle();
            this.world.lastThrowTime = now;
        }
    }

    /** Performs the bottle throw action. */
    throwBottle() {
        this.world.character.resetIdleTimer();
        const direction = this.world.character.otherDirection ? "left" : "right";
        const bottle = new ThrowableObject(
            this.world.character.x + 50,
            this.world.character.y + 100,
            direction
        );
        bottle.world = this.world;
        this.world.throwableObjects.push(bottle);
        this.world.character.bottles--;
        this.world.statusBarBottle.setPercentage(this.world.character.bottles * 20);
    }

    /** Clears all intervals and stops animations of character and enemies. */
    clearAllIntervals() {
        this.world.intervals.forEach(clearInterval);
        this.world.intervals = [];
        if (this.world.character?.stopIntervals) this.world.character.stopIntervals();
        this.world.level?.enemies?.forEach(e => e.stopIntervals?.());
    }
}