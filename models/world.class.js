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
        statusBarBoss = new StatusBarBoss();

        // coin_sound = new Audio('audio/coin.mp3');
        // bottle_sound = new Audio('audio/bottle.mp3');
        // throw_sound = new Audio('audio/throw.mp3');
        // hit_sound = new Audio('audio/boss_hit.mp3');
        // splash_sound = new Audio('audio/splash.mp3');



        throwableObjects = [];
        splashObjects = [];


        
        constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.checkThrowObjects(); // ✅ WICHTIG
    }


        setWorld() {
            this.character.world = this;

            this.character.animate();

            this.level.enemies.forEach(enemy => {
                enemy.world = this;
            if (enemy instanceof Endboss) {
                this.boss = enemy; // 👈 SPEICHERN
                enemy.animate(); 
                }
        });

    }

    checkCollisions() {
        setInterval(() => {

            // 🟥 Character vs Enemies
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBarHealth.setPercentage(this.character.energy);
                }
            });

            // 🟡 Coins sammeln
            this.level.coins.forEach((coin, index) => {
                if (this.character.isColliding(coin)) {
                    this.character.coins++;
                    this.statusBarCoin.setPercentage(this.character.coins * 20);
                    // this.coin_sound.play();
                    this.level.coins.splice(index, 1);
                }
            });

            // 🟢 Bottles sammeln
            this.level.bottles.forEach((bottle, index) => {
                if (this.character.isColliding(bottle)) {
                    this.character.bottles++;
                    this.statusBarBottle.setPercentage(this.character.bottles * 20);
                    // this.bottle_sound.play();
                    this.level.bottles.splice(index, 1);
                }
            });

            // 💥 Flasche trifft Endboss
            this.throwableObjects.forEach((bottle, bIndex) => {
                this.level.enemies.forEach((enemy) => {

                    if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
                        enemy.hit();

                    this.statusBarBoss.setPercentage(enemy.energy); // 👈 DAS IST DER KEY    

                        // let splash = new Splash(enemy.x, enemy.y);
                    let splash = new Splash(enemy.x + enemy.width / 15, enemy.y + enemy.height / 3);

                        this.splashObjects.push(splash);
                        // this.splash_sound.play();

                        console.log("Boss hit!", enemy.energy);

                        // this.hit_sound.play();
                        this.throwableObjects.splice(bIndex, 1);
                    }
                });

                

            });
            this.splashObjects = this.splashObjects.filter(s => !s.finished);
            this.level.enemies = this.level.enemies.filter(e => !e.markedForDeletion);



        }, 1000 / 25 );

      
    }



    checkThrowObjects() {
        setInterval(() => {
            if (this.keyboard.D && this.character.bottles > 0) {

                let bottle = new ThrowableObject(
                    this.character.x + 50,
                    this.character.y + 100,
                    this.character.otherDirection ? 'left' : 'right'
                );
                
                    // this.throw_sound.play();
                    this.throwableObjects.push(bottle);

                    this.character.bottles--;
                    this.statusBarBottle.setPercentage(this.character.bottles * 20);
                }
        }, 200);
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
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.splashObjects);
        

        this.ctx.translate(-this.camera_x, 0);
        
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarBoss);

        
  

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