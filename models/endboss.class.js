class Endboss extends MoveableObject {
    height = 400;
    width = 280;
    y = 65;
    phase = 1;
    energy = 100;
    world;
    currentImages = 0;
    currentState = "walk";

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates an instance of the Endboss (final boss chicken).
     * Loads all animation image sequences, sets initial position, speed, and state.
     * The endboss starts in walking state and will become aggressive when the character comes close.
     * @constructor
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.startX = this.x;
        this.speed = 2.5;
        this.aggressiveSpeed = 8;
        this.aggressiveRange = 300;
        this.otherDirection = true;
        this.normalY = 65;
        this.flyingY = 40;
        this.currentState = "walk";
        this.isDeadState = false;
        this.offset = {       
            top: 60,
            bottom: 20,
            left: 40,
            right: 40
        };
    }

    /**
     * Starts both movement and animation intervals for the endboss.
     * Clears any existing intervals before starting new ones.
     * @returns {void}
     */
    animate() {
        this.clearIntervals();
        this.startMoveInterval();
        this.startAnimationInterval();
    }

    /**
     * Checks if the endboss should transition to phase 2 (low health).
     * Phase 2 increases speed and alert range.
     * @returns {void}
     */
    checkPhase() {
        if (this.energy < 30 && this.phase === 1) {
            this.enterPhase2();
        }
    }

    /**
     * Transitions the endboss to phase 2, boosting speed and alert range.
     * @returns {void}
     */
    enterPhase2() {
        this.phase = 2;
        this.speed = 3;
        this.alertRange = 800;
    }

    /**
     * Calculates the absolute distance between the endboss and the character.
     * @returns {number} Distance in pixels.
     */
    distanceToCharacter() {
        return Math.abs(this.world.character.x - this.x);
    }

    /**
     * Determines if the endboss is currently attacking based on distance to character.
     * @returns {boolean} True if within aggressive range.
     */
    isAttacking() {
        return this.distanceToCharacter() < this.aggressiveRange;
    }

    /**
     * Checks if the endboss is in a hurt state (recently hit).
     * Overrides MoveableObject.isHurt with a shorter cooldown (0.5 seconds).
     * @returns {boolean} True if hurt within the last 0.5 seconds.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return timepassed / 1000 < 0.5;
    }

    /**
     * Reduces the endboss's energy by 10 points when hit.
     * If energy drops to zero, marks the boss as dead.
     * Prevents multiple hits after death.
     * @returns {void}
     */
    hit() {
        if (this.isDeadState) return;
        this.energy -= 10;
        
        if (this.energy < 0) this.energy = 0;
        this.lastHit = Date.now();
        if (this.energy === 0) {
            this.isDeadState = true;
        }
    }

    /**
     * Checks if the endboss has no energy left (dead).
     * @returns {boolean} True if energy <= 0.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Clears any existing movement and animation intervals.
     * @returns {void}
     */
    clearIntervals() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
    }

    /**
     * Starts the interval that updates the endboss's movement and position.
     * @returns {void}
     */
    startMoveInterval() {
        this.moveInterval = setInterval(() => {
            if (!this.world || this.isDead()) return;
            this.movementStep();
        }, 1000 / 25);
    }

    /**
     * Starts the interval that updates the endboss's animation state.
     * @returns {void}
     */
    startAnimationInterval() {
        this.animationInterval = setInterval(() => {
            if (!this.world) return;
            this.updateAnimationStep();
        }, 300);
    }

    /**
     * Performs a single movement step: updates phase, horizontal position and vertical offset.
     * @returns {void}
     */
    movementStep() {
        this.checkPhase();
        const characterX = this.world.character.x;
        const distance = Math.abs(characterX - this.x);
        const alertRange = this.alertRange || 650;
        const currentSpeed = this.getMovementSpeed(distance);
        this.updatePosition(characterX, distance, alertRange, currentSpeed);
        this.updateYFloating();
    }

    /**
     * Returns the current speed (normal or aggressive) based on distance to character.
     * @param {number} distance - Distance to the character in pixels.
     * @returns {number} Movement speed.
     */
    getMovementSpeed(distance) {
        return (distance < this.aggressiveRange) ? this.aggressiveSpeed : this.speed;
    }

    /**
     * Updates the endboss's x-position and direction based on character proximity.
     * @param {number} characterX - Character's x-coordinate.
     * @param {number} distance - Distance to character.
     * @param {number} alertRange - Range in which the endboss becomes alert.
     * @param {number} currentSpeed - Speed to use for movement.
     * @returns {void}
     */
    updatePosition(characterX, distance, alertRange, currentSpeed) {
        if (distance < alertRange) {
            if (characterX < this.x) {
                this.x -= currentSpeed;
                this.otherDirection = false;
            } else {
                this.x += currentSpeed;
                this.otherDirection = true;
            }
        } else if (this.x < this.startX) {
            this.x += currentSpeed;
            this.otherDirection = true;
        }
    }

    /**
     * Updates the vertical position: floating effect when attacking, otherwise normal Y.
     * @returns {void}
     */
    updateYFloating() {
        if (this.isAttacking()) {
            let floatOffset = Math.sin(Date.now() / 200) * 5;
            this.y = this.flyingY + floatOffset;
        } else {
            this.y = this.normalY;
        }
    }

    /**
     * Determines the current state of the endboss based on health and distance to character.
     * @returns {string} State name: 'dead', 'hurt', 'attack', 'walk', or 'idle'.
     */
    getCurrentState() {
        if (this.isDead()) return 'dead';
        if (this.isHurt()) return 'hurt';
        if (this.isAttacking()) return 'attack';
        if (Math.abs(this.world.character.x - this.x) < (this.alertRange || 650)) return 'walk';
        return 'idle';
    }

    /**
     * Performs one animation step: resolves the new state and plays the corresponding animation.
     * Resets image index on state change.
     * @returns {void}
     */
    updateAnimationStep() {
        let newState = this.getCurrentState();
        if (newState === 'dead') return this.playAnimation(this.IMAGES_DEAD);
        if (this.currentState !== newState) this.currentImages = 0, this.currentState = newState;
        const anims = {hurt: this.IMAGES_HURT, attack: this.IMAGES_ATTACK, walk: this.IMAGES_WALKING, idle: this.IMAGES_ALERT};
        this.playAnimation(anims[newState]);
    }
}