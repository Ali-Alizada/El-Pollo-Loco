/**
 * Loads the level and manages creation of enemies, coins and bottles.
 */
class WorldLevelManager {
    /**
     * @param {World} world - The World instance
     */
    constructor(world) {
        this.world = world;
    }

    /** Creates a fresh level with new enemies, coins and bottles. */
    loadFreshLevel() {
        this.cleanupOldLevel();
        this.world.level = new Level(
            this.createEnemies(),
            [...level1.clouds],
            [...level1.backgroundObjects],
            this.createCoins(),
            this.createBottles()
        );
        this.world.level.level_end_x = 2960;
    }

    /**
     * Creates the enemy array (normal chickens, small chickens, end boss).
     * @returns {MoveableObject[]} List of enemies
     */
    createEnemies() {
        return [
            new Chicken(800), new Chicken(1050), new Chicken(1400), new Chicken(1750),
            new SmallChicken(850), new SmallChicken(1000), new SmallChicken(1300),
            new SmallChicken(1550), new SmallChicken(1800), new SmallChicken(2400),
            new SmallChicken(2800), new SmallChicken(2950), new Endboss()
        ];
    }

    /**
     * Creates a random distribution of coins.
     * @returns {Coin[]} List of coins
     */
    createCoins() {
        let coins = [];
        for (let i = 0; i < 10; i++) {
            coins.push(new Coin(200 + Math.random() * 2000, 60 + Math.random() * 100));
        }
        return coins;
    }

    /**
     * Creates a random distribution of bottles (items).
     * @returns {Bottle[]} List of bottles
     */
    createBottles() {
        let bottles = [];
        for (let i = 0; i < 10; i++) {
            bottles.push(new Bottle(200 + Math.random() * 2000, 100));
        }
        return bottles;
    }

    /** Stops all intervals of the old level and the character. */
    cleanupOldLevel() {
        this.world.level?.enemies?.forEach(e => e.stopIntervals?.());
        this.world.character?.stopIntervals?.();
    }

    /** Connects the world reference to all objects (character, enemies, clouds). */
    setWorld() {
        this.world.character.world = this.world;
        this.world.character.stopIntervals?.();
        this.world.character.animate();
        this.world.level.enemies.forEach(enemy => {
            enemy.world = this.world;
            if (enemy instanceof Endboss) {
                this.world.boss = enemy;
                enemy.stopIntervals?.();
                enemy.animate();
            }
        });
        this.world.level.clouds.forEach(cloud => cloud.world = this.world);
    }
}