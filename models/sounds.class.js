class SoundManager {

    constructor() {
        this.muted = false;
        this.sounds = {
            coin: new Audio('assets/audio/collectibles/collectSound.wav'),
            bottle: new Audio('assets/audio/collectibles/bottleCollectSound.wav'),
            hit: new Audio('assets/audio/character/characterDamage.mp3'),
            jump: new Audio('assets/audio/character/characterJump.wav'),
            walking: new Audio('assets/audio/character/characterRun.mp3'),
            snoring: new Audio('assets/audio/character/characterSnoring.mp3'),
            // characterDead: new Audio('assets/audio/character/characterDead.wav'),
            chicken: new Audio('assets/audio/chicken/chickenDead.mp3'),
            smallChicken: new Audio('assets/audio/chicken/chickenDead2.mp3'),
            bossHit: new Audio('assets/audio/endboss/endboss-angry.mp3'),
            splash: new Audio('assets/audio/throwable/bottleBreak.mp3'),
            gameOver: new Audio('assets/audio/gameover/defeat.mp3'),
            win: new Audio('assets/audio/victory/victory.mp3'),
            bgMusic: new Audio('assets/audio/bgsound/bgSound-1.mp3')


        };

        Object.values(this.sounds).forEach(s => {
            s.volume = 0.2;
            s.loop = false;
        });

        
    }

            play(name) {
            if (!this.muted) {
                this.sounds[name].play();
            }
        }

        stop(name) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }

        loop(name) {
            if (!this.muted) {
                this.sounds[name].loop = true;
                this.sounds[name].play();
            }
        }

        toggle() {
            this.muted = !this.muted;

            if (this.muted) {
                Object.values(this.sounds).forEach(sound => sound.pause());
            } else {
                this.loop('bgMusic');
            }
        }
}
