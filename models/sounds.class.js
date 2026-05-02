/**
 * Manages all game sounds, including playback, looping, muting, and persistence of mute state via localStorage.
 * @class SoundManager
 */
class SoundManager {
    constructor() {
        const savedMuted = localStorage.getItem('soundMuted');
        this.muted = savedMuted === 'true';

        this.sounds = {
            coin: new Audio('assets/audio/collectibles/collectSound.wav'),
            bottle: new Audio('assets/audio/collectibles/bottleCollectSound.wav'),
            hit: new Audio('assets/audio/character/characterDamage.mp3'),
            jump: new Audio('assets/audio/character/characterJump.wav'),
            walking: new Audio('assets/audio/character/characterRun.mp3'),
            snoring: new Audio('assets/audio/character/characterSnoring.mp3'),
            chicken: new Audio('assets/audio/chicken/chickenDead.mp3'),
            smallChicken: new Audio('assets/audio/chicken/digitalstore07-chicken-430403.mp3'),
            bossHit: new Audio('assets/audio/endboss/endboss-angry1.mp3'),
            splash: new Audio('assets/audio/throwable/bottleBreak.mp3'),
            gameOver: new Audio('assets/audio/gameover/defeat.mp3'),
            win: new Audio('assets/audio/victory/victory.mp3'),
            bgMusic: new Audio('assets/audio/bgsound/bgSound-1.mp3')
        };

        Object.values(this.sounds).forEach(s => {
            s.volume = 0.1;
            s.loop = false;
        });
    }

    /**
     * Plays a sound effect once (if not muted). Resets playback position to start.
     * @param {string} name - The key of the sound in the `sounds` object (e.g., 'coin', 'hit').
     * @returns {void}
     */
    play(name) {
        if (!this.muted) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(e => console.log());
        }
    }

    /**
     * Stops a playing sound and resets its playback position to the beginning.
     * @param {string} name - The key of the sound in the `sounds` object.
     * @returns {void}
     */
    stop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }
    }

    /**
     * Starts playing a sound in a continuous loop (if not muted).
     * @param {string} name - The key of the sound in the `sounds` object.
     * @returns {void}
     */
    loop(name) {
        if (!this.muted) {
            this.sounds[name].loop = true;
            this.sounds[name].play().catch(e => console.log());
        }
    }

    /**
     * Toggles the mute state, persists it to localStorage, and stops all currently playing sounds if muted.
     * @returns {void}
     */
    toggle() {
        this.muted = !this.muted;
        localStorage.setItem('soundMuted', this.muted);

        if (this.muted) {
            Object.values(this.sounds).forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
        }
    }
}