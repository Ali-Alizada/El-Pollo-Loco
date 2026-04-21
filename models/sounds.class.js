class SoundManager {

    constructor() {
        this.sounds = {
            coin: new Audio('assets/audio/collectibles/collectSound.wav'),
            bottle: new Audio('assets/audio/collectibles/bottleCollectSound.wav'),
            hit: new Audio('assets/audio/character/characterDamage.mp3'),
            jump: new Audio('assets/audio/character/characterJump.wav'),
            chicken: new Audio('assets/audio/chicken/chickenDead.mp3'),
            smallChicken: new Audio('assets/audio/chicken/chickenDead2.mp3'),
            bossHit: new Audio('assets/audio/endboss/endbossApproach.wav'),
            splash: new Audio('assets/audio/throwable/bottleBreak.mp3')
        };
           Object.values(this.sounds).forEach(s => {
            s.volume = 0.5;
            });
    }

    play(name) {
        let sound = this.sounds[name];
        if (!sound) return;

        sound.pause();
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    loop(name) {
        let sound = this.sounds[name];
        if (!sound) return;

        sound.loop = true;

        if (sound.paused) {
            sound.play().catch(() => {});
        }
    }

    stop(name) {
        let sound = this.sounds[name];
        if (!sound) return;

        sound.pause();
        sound.currentTime = 0;
    }
}
