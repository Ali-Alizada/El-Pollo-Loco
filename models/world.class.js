class World {


        character = new Character();
        level = level1;
        canvas;
        ctx;
        keyboard;
        camera_x = 0;
        gameWon = false;
        statusBarHealth = new Statusbarhealth();
        statusBarBottle = new Statusbarbottle();
        statusBarCoin = new Statusbarcoin();
        statusBarBoss = new StatusBarBoss();

    



        


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
        this.sound = new SoundManager();
        
        // this.sound = new SoundManager();
        // this.sound.sounds.jump.volume = 0.5;




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


        isJumpingOn(enemy) {
            return this.character.speedY < 0 &&
            this.character.y + this.character.height < enemy.y + 40;


            

        }


        killNearbyChickens(hitEnemy) {
        
            this.level.enemies.forEach((enemy) => {

                if (enemy instanceof Chicken) {
                
                if (enemy instanceof SmallChicken) {
                    this.sound.play('smallChicken');
                } else {
                    this.sound.play('chicken');
                }

                let distance = Math.abs(enemy.x - hitEnemy.x);

                if (distance < 80) { // 🔥 Radius anpassen!
                    enemy.die();
                   

                }
            }
        });

        setTimeout(() => {
            this.character.speedY = 20;
        }, 50);

    }

    spawnBottle(x, y) {
    let bottle = new Bottle(x, y);
    this.level.bottles.push(bottle);
}


    showVictoryScreen() {
        this.gameWon = true;
    }

        
    drawVictoryScreen() {

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "50px Arial";
        this.ctx.fillText("🏆 YOU WIN!", 220, 200);

        this.ctx.font = "25px Arial";
        this.ctx.fillText("Press F5 to restart", 250, 260);
    }

    checkCollisions() {
        setInterval(() => {

                this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {

                    if (enemy instanceof Chicken && this.isJumpingOn(enemy)) {
                        this.killNearbyChickens(enemy);  
                        
                             
                    } 
                    
                    else {
                        this.character.hit();
                        this.sound.play('hit'); 
                        this.statusBarHealth.setPercentage(this.character.energy);    
                    }
                }               
            });

            // 🟡 Coins sammeln
            this.level.coins.forEach((coin, index) => {
                if (this.character.isColliding(coin)) {
                    this.character.coins++;
                    
                    let percent = this.character.coins * 20;
                    percent = Math.min(percent, 100);

                    this.statusBarCoin.setPercentage(percent);
                    this.sound.play('coin');



                    this.level.coins.splice(index, 1);
                }
            });

            // 🟢 Bottles sammeln
            this.level.bottles.forEach((bottle, index) => {
                if (this.character.isColliding(bottle)) {
                    this.character.bottles++;

                    let percent = this.character.bottles * 20;
                    percent = Math.min(percent, 100);
                    this.statusBarBottle.setPercentage(percent);
                    this.sound.play('bottle');


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

                        console.log("Boss hit!", enemy.energy);
                        this.sound.play('bossHit');
                        
                        this.throwableObjects.splice(bIndex, 1);
                    }
                });

                

            });

            this.splashObjects = this.splashObjects.filter(s => !s.finished);
            this.level.enemies = this.level.enemies.filter(e => !e.markedForDeletion);

        }, 1000 / 15 );

      
    }


    checkThrowObjects() {
        setInterval(() => {
            if (this.keyboard.D && this.character.bottles > 0) {

                let bottle = new ThrowableObject(
                    this.character.x + 50,
                    this.character.y + 100,
                    this.character.otherDirection ? 'left' : 'right'
                );
                
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
        // this.addToMap(this.statusBarBoss);

        if (this.character.x > 2400) {
        this.addToMap(this.statusBarBoss);
        }

        // Draw wird in der draw() Funktion aufgerufen, damit es immer wieder neu gezeichnet wird
        requestAnimationFrame(() => this.draw());
        // let self = this;
        // requestAnimationFrame(function() {
        //     self.draw();
        // });


        
        if(this.gameWon) {
        this.drawVictoryScreen();   

        if (this.gameWon) return;
        }


  

    }

    addObjectsToMap(objects) {         
        objects.forEach((object) => {
            this.addToMap(object);
        });

        
    }

    addToMap(moveableObject) {
       if (moveableObject.visible === true) return;


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