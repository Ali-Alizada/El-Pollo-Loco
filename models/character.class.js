class Character extends MoveableObject {
    height = 250;
    width = 120;
    speed = 12; 
    coins = 0;
    bottles = 0;
    lastHitTime = 0;
    lastMoveTime = new Date().getTime();
    hitCooldown = 300; 
    walkingSoundPlaying = false;
    snoringSoundPlaying = false;
    deadSoundPlayed = false;
    jumpAnimationPlayed = false;
    spawnProtected = true;

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_WALKING = [
            'img/2_character_pepe/2_walk/W-21.png',
            'img/2_character_pepe/2_walk/W-22.png',
            'img/2_character_pepe/2_walk/W-23.png',
            'img/2_character_pepe/2_walk/W-24.png',
            'img/2_character_pepe/2_walk/W-25.png',
            'img/2_character_pepe/2_walk/W-26.png'
        
    ];

    IMAGES_JUMPING = [
            'img/2_character_pepe/3_jump/J-31.png',
            'img/2_character_pepe/3_jump/J-32.png',
            'img/2_character_pepe/3_jump/J-33.png',
            'img/2_character_pepe/3_jump/J-34.png',
            'img/2_character_pepe/3_jump/J-35.png',
            'img/2_character_pepe/3_jump/J-36.png',
            'img/2_character_pepe/3_jump/J-37.png',
            'img/2_character_pepe/3_jump/J-38.png',
            'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-41.png'
    ];

    IMAGES_DEAD = [
            'img/2_character_pepe/5_dead/D-51.png',
            'img/2_character_pepe/5_dead/D-52.png',
            'img/2_character_pepe/5_dead/D-53.png',
            'img/2_character_pepe/5_dead/D-54.png',
            'img/2_character_pepe/5_dead/D-55.png',
            'img/2_character_pepe/5_dead/D-56.png',
            'img/2_character_pepe/5_dead/D-57.png'
    ];

    world;
   /**
     * Creates a new Character (Pepe) instance.
     * Loads all animation images, sets up gravity, collision offsets, and spawn protection.
     * @constructor
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.setToGround();
        this.applyGravity();
        this.invincibleUntil = 0;
        this.spawnProtected = true;
        this.hasKilledChicken = false;
        this.deathLoopCount = 0;
        this.maxDeathLoops = 3;
            this.offset = {
            top: 120,  
            bottom: 15,
            left: 30,
            right: 30
        };
        setTimeout(() => this.spawnProtected = false, 2000);
    }

    /**
     * Starts both movement and animation intervals for the character.
     * Clears any existing intervals before starting new ones.
     * @returns {void}
     */
    animate() {
        this.clearCharacterIntervals();
        this.startMovementInterval();
        this.startAnimationInterval();
    }
    /**
     * Calculates the foot-level hitbox of the object, typically used for ground collision or stomping mechanics.
     * The hitbox is positioned at the bottom of the object, spanning most of its width.
     * @returns {{x: number, y: number, width: number, height: number}} An object defining the foot hitbox position and size.
     */
    getFootHitbox() {
        return {
            x: this.x + 10,           
            y: this.y + this.height - 25,
            width: this.width - 20,    
            height: 25                 
        };
    }

    /**
     * Clears movement and animation intervals if they exist.
     * @returns {void}
     */
    clearCharacterIntervals() {
        if (this.moveAnimationInterval) clearInterval(this.moveAnimationInterval);
        if (this.stateAnimationInterval) clearInterval(this.stateAnimationInterval);
    }

    /**
     * Starts the interval that handles movement, input, and camera.
     * @returns {void}
     */
    startMovementInterval() {
        this.moveAnimationInterval = setInterval(() => {
            if (!this.world || this.world.gameState !== 'running') {
                this.world?.sound.stop('walking');
                this.world?.sound.stop('snoring');
                return;
            }
            this.handleMovementInput();
            this.handleWalkingSound();
            this.handleJumpInput();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    /**
     * Processes left/right movement keys and updates position.
     * Also updates lastMoveTime when moving.
     * @returns {void}
     */
    handleMovementInput() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.lastMoveTime = Date.now();
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.lastMoveTime = Date.now();
        }
    }

    /**
     * Plays or stops the walking sound based on whether the character is moving on ground.
     * @returns {void}
     */
    handleWalkingSound() {
        const isMoving = (this.world.keyboard.RIGHT || this.world.keyboard.LEFT);
        if (isMoving && !this.isAboveGround()) {
            if (!this.walkingSoundPlaying) {
                this.world.sound.loop('walking');
                this.walkingSoundPlaying = true;
            }
        } else {
            this.world.sound.stop('walking');
            this.walkingSoundPlaying = false;
        }
    }

    /**
     * Triggers a jump when the SPACE key is pressed and the character is on the ground.
     * @returns {void}
     */
    handleJumpInput() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.lastMoveTime = Date.now();
        }
    }

        /**
     * Starts the interval that handles state-based animation (idle, walking, jumping, hurt, dead).
     * @returns {void}
     */
    startAnimationInterval() {
        this.stateAnimationInterval = setInterval(() => {
            if (this.isAboveGround()) {
                this.playJumpAnimation();
            } else {
                this.jumpAnimationPlayed = false;
                if (this.isDead()) {
                    this.playDeadAnimation();
                } else if (this.isHurt()) {
                    this.playAnimation(this.IMAGES_HURT);
                } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                } else {
                    this.handleIdleAnimation();
                }
            }
        }, 75);
    }
    

    /**
     * Plays the jumping animation and resets the image index on the first frame.
     * @returns {void}
     */
    playJumpAnimation() {
        if (!this.jumpAnimationPlayed) {
            this.currentImages = 0;
            this.jumpAnimationPlayed = true;
        }
        this.playAnimation(this.IMAGES_JUMPING);
        if (this.currentImages >= this.IMAGES_JUMPING.length) {
            this.currentImages = this.IMAGES_JUMPING.length - 1;
        }
    }

    /**
     * Plays the death animation and transitions the game state to "lose" when finished.
     * @returns {void}
     */
    playDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    if (this.currentImages >= this.IMAGES_DEAD.length) {
        this.deathLoopCount++;
        if (this.deathLoopCount < this.maxDeathLoops) {
            this.currentImages = 0;
        } else if (this.world.gameState === "dying") {
            this.world.gameState = "lose";
        }
    }
    }

    /**
     * Handles idle (short idle) and long idle (snoring) animations based on time since last movement.
     * @returns {void}
     */
    handleIdleAnimation() {
        const idleTime = Date.now() - this.lastMoveTime;
        if (idleTime > 10000) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            if (!this.snoringSoundPlaying) {
                this.world.sound.loop('snoring');
                this.snoringSoundPlaying = true;
            }
        } else {
            this.playAnimation(this.IMAGES_IDLE);
            this.world.sound.stop('snoring');
            this.snoringSoundPlaying = false;
        }
    }

    /**
     * Resets the idle timer and stops snoring sound.
     * Called when the character moves or interacts.
     * @returns {void}
     */
    resetIdleTimer() {
        this.lastMoveTime = Date.now();
        if (this.world) {
            this.world.sound.stop('snoring');
            this.snoringSoundPlaying = false;
        }
    }

    /**
     * Updates character position based on keyboard axis input.
     * @deprecated (Legacy method, kept for compatibility)
     * @returns {void}
     */
    updateMovement() {
        if (this.world.keyboard.axisX !== 0) {
            this.x += this.world.keyboard.axisX * 5;
        }
        if (this.world.keyboard.RIGHT) this.moveRight();
        if (this.world.keyboard.LEFT) this.moveLeft();
    }

    /**
     * Reduces character health by 5 when hit, respecting invincibility frames and cooldown.
     * Sets invincibility for 1 second and records hit timestamp.
     * @returns {void}
     */
    hit() {
        let now = Date.now();
        if (now < this.invincibleUntil) return;
        if (now - this.lastHitTime > this.hitCooldown) {
            this.energy -= 5;
            if (this.energy < 0) this.energy = 0;
            this.lastHitTime = now;
            this.lastHit = now;               
            this.invincibleUntil = now + 1000;
            this.lastMoveTime = now;          
            this.currentImages = 0;          
        }
    }

    /**
     * Makes the character jump upward (sets vertical speed) and plays jump sound.
     * Resets the flag that indicates a chicken was killed.
     * @returns {void}
     */
    jump() {
        this.speedY = 30;
        this.hasKilledChicken = false; 
        this.isJumping = true;
        this.currentImages = 0;
        this.world.sound.play('jump');
    }
}