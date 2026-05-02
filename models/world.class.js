/**
 * Main game class. Coordinates managers for collisions, rendering, state, loops and levels.
 */
class World {
    character = new Character();
    level = null;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    images;
    sound;
    gameState = "running";
    statusBarHealth = new Statusbarhealth();
    statusBarBottle = new Statusbarbottle();
    statusBarCoin = new Statusbarcoin();
    statusBarBoss = new StatusBarBoss();
    throwableObjects = [];
    splashObjects = [];
    intervals = [];
    lastThrowTime = 0;
    throwCooldown = 500;
    loseSoundPlayed = false;
    winSoundPlayed = false;
    boss;

    /**
     * Creates a new game world.
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {Keyboard} keyboard - The keyboard (and touch) control object
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.images = new ImageManager();
        this.sound = new SoundManager();
        this.gameState = "start";
        this.collisionHandler = new WorldCollisionHandler(this);
        this.renderer = new WorldRenderer(this);
        this.stateManager = new WorldStateManager(this);
        this.loopManager = new WorldLoopManager(this);
        this.levelManager = new WorldLevelManager(this);
        this.levelManager.loadFreshLevel();
        this.levelManager.setWorld();
        this.renderer.draw();
        this.loopManager.startGameLoops();
    }

    /**
     * Delegates UI clicks to the state manager.
     * @param {string} action - Action (start, restart, back, sound, fullscreen)
     */
    handleClick(action) {
        this.stateManager.handleClick(action);
    }

    /** Stops all running sound effects (walking, snoring, music). */
    stopAllSounds() {
        this.stateManager.stopAllSounds();
    }

    /** Clears all game intervals (game loops). */
    clearAllIntervals() {
        this.loopManager.clearAllIntervals();
    }

    /**
     * Spawns a new bottle at a given position (dropped by small chickens).
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    spawnBottle(x, y) {
        this.collisionHandler.spawnBottle(x, y);
    }
}