class MoveableObject extends Drawableobject {
  
    static GROUND_Y = 420; 
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return (this.y + this.height) < MoveableObject.GROUND_Y;
    }
      setToGround() {
        this.y = MoveableObject.GROUND_Y - this.height;
    }

    isColliding(moveableObject) {
    return this.x + this.width > moveableObject.x &&
        this.y + this.height > moveableObject.y &&
        this.x < moveableObject.x + moveableObject.width &&
        this.y < moveableObject.y + moveableObject.height;
    }

    hit() {
        this.energy -= 5;
        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; 
    timepassed = timepassed / 1000; 
    return timepassed < 0.8;    
    }

    isDead() {
        return this.energy == 0;
    }
    
    playAnimation(images) {
        let i = this.currentImages % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImages++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
            this.x -= this.speed;    
    }

    jump() {
        this.speedY = 30;
    }
} 