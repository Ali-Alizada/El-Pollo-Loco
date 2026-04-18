class World {


    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new Statusbarhealth();
    statusBarBottle = new Statusbarbottle();
    statusBarCoin = new Statusbarcoin();
    coin_sound = new Audio('audio/coin.mp3');
    bottle_sound = new Audio('audio/bottle.mp3');

    
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;

        this.character.animate();

        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        if (enemy instanceof Endboss) {
            enemy.animate(); 
            }
     });

    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if(this.character.isColliding(enemy)) {
                    this.character.hit();
                    console.log('collision with character, energy', this.character.energy);
                    this.statusBarHealth.setPercentage(this.character.energy);
                    this.coin_sound.volume = 0.2; // Sound wird hier leiser gemacht!
 
                    if(enemy instanceof Endboss) {
                        enemy.hit();
                        console.log('collision with endboss, energy', enemy.energy);
                    }
                }

            this.level.coins.forEach((coin, index) => {
                if (this.character.isColliding(coin)) {

                    this.character.coins += 1;
                    this.statusBarCoin.setPercentage(this.character.coins * 20);

                    this.coin_sound.play();

                    // Entfernen aus Welt
                    this.level.coins.splice(index, 1);
                }
            });


            this.level.bottles.forEach((bottle, index) => {
                if (this.character.isColliding(bottle)) {

                    this.character.bottles += 1;
                    this.statusBarBottle.setPercentage(this.character.bottles * 20);

                    this.bottle_sound.play();

                    this.level.bottles.splice(index, 1);
                }
            });



            });
        }, 1000 / 25 );
     }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
 
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);       
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        

        this.ctx.translate(-this.camera_x, 0);
        
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        
  

        // Draw wird in der draw() Funktion aufgerufen, damit es immer wieder neu gezeichnet wird
        requestAnimationFrame(() => this.draw());
        // let self = this;
        // requestAnimationFrame(function() {
        //     self.draw();
        // });
    }

    addObjectsToMap(objects) {         
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    addToMap(moveableObject) {
        if (moveableObject.otherDirection){
           this.flipImage(moveableObject);
        }

            moveableObject.draw(this.ctx);
            moveableObject.drawFrame(this.ctx);

        if (moveableObject.otherDirection){ 
           this.flipImageBack(moveableObject);
        }
    }

    flipImage(moveableObject) {
            this.ctx.save();
            this.ctx.translate(moveableObject.width, 0)
            this.ctx.scale(-1,1)
            moveableObject.x = moveableObject.x * -1;
    }

    flipImageBack(moveableObject) {
            moveableObject.x = moveableObject.x * -1;
            this.ctx.restore();
    }
    
}