class Level {
    enemies;
    boss;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 2960;

    /**
     * Creates a new game level with all its entities.
     * @param {Array} enemies - Array of enemy objects in the level.
     * @param {Array} clouds - Array of cloud objects for the background.
     * @param {Array} backgroundObjects - Array of background layer objects.
     * @param {Array} coins - Array of collectible coin objects.
     * @param {Array} bottles - Array of collectible bottle objects.
     * @returns {void}
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}