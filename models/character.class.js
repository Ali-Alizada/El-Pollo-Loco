class Character extends MoveableObject {
    y = 95;
    height = 230;
    width = 120;
    speed = 15; 
    coins = 0;
    bottles = 0;
    lastHitTime = 0;
    lastMoveTime = new Date().getTime();
    hitCooldown = 300; // 0.3 Sekunde Pause
    walkingSoundPlaying = false;
    snoringSoundPlaying = false;
    deadSoundPlayed = false;


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
    constructor() {     
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity(); 
    } 

            animate() {

            setInterval(() => {

            if (this.world.gameState !== 'running') {
                this.world.sound.stop('snoring');
                this.world.sound.stop('walking');
                return;
            }

            // 👉 Bewegung
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                this.lastMoveTime = new Date().getTime();

            } else if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                this.lastMoveTime = new Date().getTime();
            }

            // 👉 Walking Sound (GETRENNT!)
            if (
                (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) &&
                !this.isAboveGround()
            ) {
                if (!this.walkingSoundPlaying) {
                    this.world.sound.loop('walking');
                    this.walkingSoundPlaying = true;
                }
            } else {
                this.world.sound.stop('walking');
                this.walkingSoundPlaying = false;
            }

            // 👉 Jump
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.lastMoveTime = new Date().getTime();
            }

            // 👉 Kamera
            this.world.camera_x = -this.x + 100;

        }, 1000 / 60);

        setInterval(() => {

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);

                if (!this.deadSoundPlayed) {
                this.world.sound.play('characterDead');
                this.deadSoundPlayed = true;
            }
                return;
            }

            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                return;
            }

            if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
                return;
            }

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
                return;
            }

            let idleTime = new Date().getTime() - this.lastMoveTime;

            if (idleTime > 3000) {

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

        }, 50);

    }


        hit() {
        let now = new Date().getTime();

        if (now - this.lastHitTime > this.hitCooldown) {
        this.energy -= 10;

        if (this.energy < 0) {
            this.energy = 0;
        }

        this.lastHitTime = now;
        this.lastHit = now;
            }
        }

        jump() {
        console.log("JUMP");
        this.speedY = 30;
        this.world.sound.play('jump');  
        }
}