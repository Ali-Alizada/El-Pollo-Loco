/**
 * Manages game state (start, restart, back, sound, fullscreen) and UI actions.
 */
class WorldStateManager {
    /**
     * @param {World} world - The World instance
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Handles clicks on UI elements.
     * @param {string} action - Action: "start", "restart", "back", "sound", "fullscreen"
     * @returns {void}
     */
    handleClick(action) {
        if (action === "start") this.startGame();
        else if (action === "restart") this.performRestart();
        else if (action === "back") this.resetToHome();
        else if (action === "sound") this.toggleSound();
        else if (action === "fullscreen") window.toggleFullscreen?.();
    }

    /**
     * Starts the running game (sets state, starts background music).
     * @returns {void}
     */
    startGame() {
        this.world.gameState = "running";
        this.world.sound.loop("bgMusic");
        window.showScreen?.(null);
    }

    /**
     * Toggles sound on/off and handles background music accordingly.
     * @returns {void}
     */
    toggleSound() {
        this.world.sound.toggle();
        if (!this.world.sound.muted && this.world.gameState === "running") {
            this.world.sound.loop("bgMusic");
        } else if (this.world.sound.muted) {
            this.world.sound.stop("bgMusic");
        }
        window.updateSoundIcon?.();
    }

    /**
     * Resets the entire game to its initial state (start screen).
     * @returns {void}
     */
    resetToHome() {
        this.world.clearAllIntervals();
        this.world.stopAllSounds();
        this.world.gameState = "start";
        this.world.loseSoundPlayed = this.world.winSoundPlayed = false;
        this.world.throwableObjects = [];
        this.world.splashObjects = [];
        this.world.levelManager.loadFreshLevel();
        this.resetCharacter();
        this.resetStatusBars();
        this.world.levelManager.setWorld();
        this.world.loopManager.startGameLoops();
        window.showScreen?.("startScreen");
    }

    /**
     * Resets character values (energy, position, invincibility, coins/bottles).
     * @returns {void}
     */
    resetCharacter() {
        const c = this.world.character;
        c.energy = 100;
        c.coins = 0;
        c.bottles = 0;
        c.x = 120;
        c.y = 95;
        c.lastHitTime = 0;
        c.lastMoveTime = Date.now();
        c.invincibleUntil = 0;
        c.spawnProtected = true;
        setTimeout(() => (c.spawnProtected = false), 2000);
    }

    /**
     * Resets all status bars to their default values.
     * @returns {void}
     */
    resetStatusBars() {
        this.world.statusBarHealth = new Statusbarhealth();
        this.world.statusBarCoin = new Statusbarcoin();
        this.world.statusBarBottle = new Statusbarbottle();
        this.world.statusBarBoss = new StatusBarBoss();
        this.world.statusBarHealth.setPercentage(100);
        this.world.statusBarCoin.setPercentage(0);
        this.world.statusBarBottle.setPercentage(0);
        this.world.statusBarBoss.setPercentage(100);
    }

    /**
     * Performs a complete game restart (from start screen).
     * @returns {void}
     */
    performRestart() {
        this.resetToHome();
        this.world.gameState = "running";
        this.world.sound.loop("bgMusic");
        window.showScreen?.(null);
    }

    /**
     * Stops all sound effects (walking, snoring, music).
     * @returns {void}
     */
    stopAllSounds() {
        this.world.sound.stop("snoring");
        this.world.sound.stop("walking");
        this.world.sound.stop("bgMusic");
    }

    /**
     * Initiates the win sequence, delaying the full win to allow animations.
     * @returns {void}
     */
    initiateWin() {
        if (this.world.gameState !== "running") return;
        this.world.gameState = "winPending";
        this.world.sound.stop("walking");
        setTimeout(() => {
            if (this.world.gameState === "winPending") {
                this.completeWin();
            }
        }, 1000);
    }

    /**
     * Completes the win sequence, stops all sounds, shows the win screen.
     * @returns {void}
     */
    completeWin() {
        if (this.world.gameState !== "winPending") return;
        this.world.gameState = "win";
        this.world.stopAllSounds();
        if (!this.world.winSoundPlayed) {
            this.world.sound.play("win");
            this.world.winSoundPlayed = true;
        }
        this.world.clearAllIntervals();
        window.showScreen?.("winScreen");
    }
}