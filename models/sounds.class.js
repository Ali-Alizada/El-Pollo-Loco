class SoundManager {

    constructor() {
        this.sounds = {
            coin: new Audio('assets/audio/collectibles/collectSound.wav'),
            bottle: new Audio('assets/audio/collectibles/bottleCollectSound.wav'),
            hit: new Audio('assets/audio/character/characterDamage.mp3'),
            jump: new Audio('assets/audio/character/characterJump.wav'),
            walking: new Audio('assets/audio/character/characterRun.mp3'),
            snoring: new Audio('assets/audio/character/characterSnoring.mp3'),
            characterDead: new Audio('assets/audio/character/characterDead.wav'),
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
        let sound = this.sounds[name];
        if (!sound) return;

        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    loop(name) {
        let sound = this.sounds[name];
        if (!sound) return;

        sound.loop = true;
        sound.play().catch(() => {});
    }

    stop(name) {
        let sound = this.sounds[name];
        if (!sound) return;

        sound.pause();
        sound.currentTime = 0;
        sound.loop = false;
    }
}
