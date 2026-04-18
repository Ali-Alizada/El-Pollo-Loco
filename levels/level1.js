    function createCoins() {
        let coins = [];

        for (let i = 0; i < 20; i++) {
            coins.push(
            new Coin(
                    200 + Math.random() * 2000,
                    60 + Math.random() * 300
                )
            );
        }

        return coins;
    }

    function createBottles() {
        let bottles = [];

        for (let i = 0; i < 20; i++) {
            bottles.push(
            new Bottle(
                    200 + Math.random() * 2000,
                    330
                )
            );
        }
        return bottles;
    }


const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],

    [new Cloud()],

    [
        new backgroudObject('img/5_background/layers/air.png', -720),
        new backgroudObject('img/5_background/layers/3_third_layer/full.png', -720), 
        new backgroudObject('img/5_background/layers/2_second_layer/2.png', -720),
        new backgroudObject('img/5_background/layers/1_first_layer/2.png', -720),

        new backgroudObject('img/5_background/layers/air.png', 0),
        new backgroudObject('img/5_background/layers/3_third_layer/1.png', 0),
        new backgroudObject('img/5_background/layers/2_second_layer/1.png', 0),
        new backgroudObject('img/5_background/layers/1_first_layer/1.png', 0),

        new backgroudObject('img/5_background/layers/air.png', 720),
        new backgroudObject('img/5_background/layers/3_third_layer/full.png', 720), 
        new backgroudObject('img/5_background/layers/2_second_layer/2.png', 720),
        new backgroudObject('img/5_background/layers/1_first_layer/2.png', 720),

        new backgroudObject('img/5_background/layers/air.png', 720*2),
        new backgroudObject('img/5_background/layers/3_third_layer/1.png', 720*2),
        new backgroudObject('img/5_background/layers/2_second_layer/1.png', 720*2),
        new backgroudObject('img/5_background/layers/1_first_layer/1.png', 720*2),

        new backgroudObject('img/5_background/layers/air.png', 720*3),
        new backgroudObject('img/5_background/layers/3_third_layer/full.png', 720*3), 
        new backgroudObject('img/5_background/layers/2_second_layer/2.png', 720*3),
        new backgroudObject('img/5_background/layers/1_first_layer/2.png', 720*3),
    ],

    createCoins(),
    createBottles()
);
