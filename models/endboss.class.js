class Endboss extends MoveableObject {
    height = 400;
    width = 280;
    y = 65;
    phase = 1;
    energy = 100;
    world;
    currentImages = 0;
    currentState = "walk";
    isDeadState = false;

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
     * Loads all animation images, sets initial position, movement values, and collision offset.
     * @constructor
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadAllImages();
        this.initPositionAndMovement();
        this.offset = { top: 60, bottom: 20, left: 40, right: 40 };
    }

    /**
     * Loads all image sequences for walking, alert, attack, hurt, and death animations.
     * @returns {void}
     */
    loadAllImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Initializes the endboss position, movement speeds, jumping parameters, and direction.
     * @returns {void}
     */
    initPositionAndMovement() {
        Object.assign(this, {
            x: 2500, minY: 40, startX: 2500, speed: 2.5,
            aggressiveSpeed: 8, aggressiveRange: 300, otherDirection: true,
            normalY: 65, flyingY: 40, jumpHeight: 80, attackJumpSpeed: 14,
            attackJumpTriggered: false, groundY: 65
        });
    }

    /**
     * Starts both movement and animation intervals.
     * Clears any existing intervals before starting new ones.
     * @returns {void}
     */
    animate() {
        this.clearIntervals();
        this.startMoveInterval();
        this.startAnimationInterval();
    }

    /**
     * Checks if endboss should transition to phase 2 (low health).
     * Phase 2 increases speed and alert range.
     * @returns {void}
     */
    checkPhase() {
        if (this.energy < 30 && this.phase === 1) {
            this.enterPhase2();
        }
    }

    /**
     * Transitions endboss to phase 2, boosting speed and alert range.
     * @returns {void}
     */
    enterPhase2() {
        this.phase = 2;
        this.speed = 3;
        this.alertRange = 800;
    }

    /**
     * Calculates absolute distance between endboss and the character.
     * @returns {number} Distance in pixels.
     */
    distanceToCharacter() {
        return Math.abs(this.world.character.x - this.x);
    }

    /**
     * Determines if endboss is within attacking range of the character.
     * @returns {boolean} True if distance is less than aggressiveRange.
     */
    isAttacking() {
        return this.distanceToCharacter() < this.aggressiveRange;
    }

    /**
     * Checks if endboss is in hurt state (recently hit).
     * Uses shorter cooldown of 0.5 seconds.
     * @returns {boolean} True if hit within last 0.5 seconds.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return timepassed / 1000 < 0.5;
    }

    /**
     * Reduces energy by 10 when hit. Marks as dead if energy reaches zero.
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
     * Checks if endboss has no energy left (dead).
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
     * Starts interval that updates endboss movement and position.
     * @returns {void}
     */
    startMoveInterval() {
        this.moveInterval = setInterval(() => {
            if (!this.world || this.isDead() || this.world.gameState !== 'running') return;
            this.movementStep();
        }, 1000 / 25);
    }

    /**
     * Starts interval that updates endboss animation state.
     * @returns {void}
     */
    startAnimationInterval() {
        this.animationInterval = setInterval(() => {
            if (!this.world || this.world.gameState !== 'running') return;
            this.updateAnimationStep();
        }, 300);
    }

    /**
     * Performs single movement step: updates phase, horizontal movement, and vertical position.
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
     * Returns current movement speed based on distance to character.
     * @param {number} distance - Distance to character in pixels.
     * @returns {number} Aggressive speed if close, normal speed otherwise.
     */
    getMovementSpeed(distance) {
        return (distance < this.aggressiveRange) ? this.aggressiveSpeed : this.speed;
    }

    /**
     * Updates endboss x-position and direction based on character proximity.
     * @param {number} characterX - Character's x-coordinate.
     * @param {number} distance - Distance to character.
     * @param {number} alertRange - Range in which endboss becomes alert.
     * @param {number} currentSpeed - Speed to use for movement.
     * @returns {void}
     */
    updatePosition(characterX, distance, alertRange, currentSpeed) {
        const stopDistance = 40;
        if (distance < alertRange) {
            if (characterX < this.x - stopDistance) {
                this.x -= currentSpeed;
                this.otherDirection = false;
            } else if (characterX > this.x + stopDistance) {
                this.x += currentSpeed;
                this.otherDirection = true;
            }
        } else if (this.x < this.startX) {
            this.x += currentSpeed;
            this.otherDirection = true;
        }
    }

    /**
     * Updates vertical position: applies attack jump logic when attacking, else resets to ground.
     * @returns {void}
     */
    updateYFloating() {
        if (this.currentState === 'attack') {
            this.handleAttackJump();
        } else {
            this.y = this.groundY;
        }
    }

    /**
     * Handles jump initiation and reset logic during attack animation.
     * Triggers jump on specific frame and resets trigger flag.
     * @returns {void}
     */
    handleAttackJump() {
        const frame = this.currentImages % this.IMAGES_ATTACK.length;
        if (frame === 2 && !this.attackJumpTriggered && this.y >= this.groundY) {
            this.speedY = this.attackJumpSpeed;
            this.attackJumpTriggered = true;
        }
        if (frame !== 2) this.attackJumpTriggered = false;
        this.applyAttackJumpPhysics();
    }

    /**
     * Applies gravity physics during an attack jump.
     * Updates vertical position and speed, respecting minimum Y limit.
     * @returns {void}
     */
    applyAttackJumpPhysics() {
        if (this.y < this.groundY || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            if (this.y <= this.minY) {
                this.y = this.minY;
                this.speedY = 0;
            }
        }
    }

    /**
     * Determines current state based on health and distance to character.
     * @returns {string} State: 'dead', 'hurt', 'attack', 'walk', or 'idle'.
     */
    getCurrentState() {
        if (this.isDead()) return 'dead';
        if (this.isHurt()) return 'hurt';
        if (this.isAttacking()) return 'attack';
        if (Math.abs(this.world.character.x - this.x) < (this.alertRange || 650)) return 'walk';
        return 'idle';
    }

    /**
     * Performs one animation step: resolves new state and plays corresponding animation.
     * Resets image index when state changes.
     * @returns {void}
     */
    updateAnimationStep() {
        let newState = this.getCurrentState();
        if (newState === 'dead') return this.playAnimation(this.IMAGES_DEAD);
        if (this.currentState !== newState) {
            this.currentImages = 0;
            this.currentState = newState;
        }
        const anims = { hurt: this.IMAGES_HURT, attack: this.IMAGES_ATTACK, walk: this.IMAGES_WALKING, idle: this.IMAGES_ALERT };
        this.playAnimation(anims[newState]);
    }
}