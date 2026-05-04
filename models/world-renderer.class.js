/**
 * Renders all game objects onto the canvas.
 */
class WorldRenderer {
    /**
     * @param {World} world - The World instance
     */
    constructor(world) {
        this.world = world;
    }

    /** Main rendering method (called every frame). */
    draw() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.world.ctx.translate(this.world.camera_x, 0);
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        this.world.ctx.translate(-this.world.camera_x, 0);
        this.drawByGameState();
        requestAnimationFrame(() => this.draw());
    }

    /** Shows the appropriate start/end screen based on game state. */
    drawByGameState() {
    if (this.world.gameState === "running" || this.world.gameState === "dying" || this.world.gameState === "winPending") {
        this.drawGameObjects();
        window.showScreen?.(null);
    } else if (this.world.gameState === "start") {
        window.showScreen?.("startScreen");
    } else if (this.world.gameState === "win") {
        window.showScreen?.("winScreen");
    } else if (this.world.gameState === "lose") {
        window.showScreen?.("loseScreen");
    }
}

    /** Draws all game-relevant objects (status bars, character, enemies, items). */
    drawGameObjects() {
        this.addToMap(this.world.statusBarHealth);
        this.addToMap(this.world.statusBarCoin);
        this.addToMap(this.world.statusBarBottle);
        this.addToMap(this.world.statusBarBoss);
        this.world.ctx.translate(this.world.camera_x, 0);
        this.addToMap(this.world.character);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.throwableObjects);
        this.addObjectsToMap(this.world.splashObjects);
        this.world.ctx.translate(-this.world.camera_x, 0);
    }

    /**
     * Draws an array of objects.
     * @param {Drawableobject[]} objects - List of objects to draw
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

    /**
     * Draws a single movable object (handles mirroring).
     * @param {MoveableObject} moveableObject - The object to draw
     */
    addToMap(moveableObject) {
        if (moveableObject.visible === true) return;
        if (moveableObject.otherDirection) this.flipImage(moveableObject);
        moveableObject.draw(this.world.ctx);
        moveableObject.drawFrame(this.world.ctx);
        if (moveableObject.otherDirection) this.flipImageBack(moveableObject);
    }

    /**
     * Mirrors an object horizontally (e.g., for left movement).
     * @param {MoveableObject} moveableObject - The object to mirror
     */
    flipImage(moveableObject) {
        this.world.ctx.save();
        this.world.ctx.translate(moveableObject.width, 0);
        this.world.ctx.scale(-1, 1);
        moveableObject.x *= -1;
    }

    /**
     * Restores the original orientation after mirroring.
     * @param {MoveableObject} moveableObject - The previously mirrored object
     */
    flipImageBack(moveableObject) {
        moveableObject.x *= -1;
        this.world.ctx.restore();
    }
}