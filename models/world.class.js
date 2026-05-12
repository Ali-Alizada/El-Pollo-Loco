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
     * Sets the current game state and stops clouds when game ends.
     * @param {string} state - New game state ("running", "start", "dying", "gameOver", "win", "winPending", "lose")
     */
    set gameState(state) {
        this._gameState = state;
        if (state === "gameOver" || state === "win" || state === "dying") {
            this.stopAllClouds();
        }
    }

    /**
     * Returns the current game state.
     * @returns {string} The current game state.
     */
    get gameState() {
        return this._gameState;
    }

    /**
     * Stops movement of all clouds in the current level.
     * @returns {void}
     */
    stopAllClouds() {
        if (this.level && this.level.clouds) {
            this.level.clouds.forEach(cloud => {
                if (cloud.stopMovement) cloud.stopMovement();
            });
        }
    }

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
        this._gameState = "start";
        this.gameState = "start";
        this._createManagers();
        this._loadAndStart();
    }

    /**
     * Creates all manager instances used by the world.
     * @private
     * @returns {void}
     */
    _createManagers() {
        this.collisionHandler = new WorldCollisionHandler(this);
        this.renderer = new WorldRenderer(this);
        this.stateManager = new WorldStateManager(this);
        this.loopManager = new WorldLoopManager(this);
        this.levelManager = new WorldLevelManager(this);
    }

    /**
     * Loads the fresh level, sets up the world reference, draws the initial frame, and starts game loops.
     * @private
     * @returns {void}
     */
    _loadAndStart() {
        this.levelManager.loadFreshLevel();
        this.levelManager.setWorld();
        this.renderer.draw();
        this.loopManager.startGameLoops();
    }

    /**
     * Delegates UI clicks to the state manager.
     * @param {string} action - Action ("start", "restart", "back", "sound", "fullscreen")
     * @returns {void}
     */
    handleClick(action) {
        this.stateManager.handleClick(action);
    }

    /**
     * Stops all running sound effects (walking, snoring, music).
     * @returns {void}
     */
    stopAllSounds() {
        this.stateManager.stopAllSounds();
    }

    /**
     * Clears all game intervals (game loops).
     * @returns {void}
     */
    clearAllIntervals() {
        this.loopManager.clearAllIntervals();
    }

    /**
     * Spawns a new bottle at a given position (dropped by small chickens).
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {void}
     */
    spawnBottle(x, y) {
        this.collisionHandler.spawnBottle(x, y);
    }
}