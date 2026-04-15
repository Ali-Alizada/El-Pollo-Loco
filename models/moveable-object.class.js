class MoveableObject {
    x = 120;
    y = 280; 
    height = 150;
    width = 100;
    img;
    imgCache = {};
    currentImages = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;


    applayGravity() {
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }

        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 195;
    }

    // laodImage('img')
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('img');
        this.img.src = path;
 
    }

    draw(ctx) {
         ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if(this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    // isColliding(moveableObject) {
    //     return this.x + this.width > moveableObject.x && this.y + this.height > moveableObject.y && this.x < moveableObject.x && this.y < moveableObject.y + moveableObject.height;
    // }

    // Kollisionserkennung mit einem anderen beweglichen Objekt -> chicken mit dem Charakter!
    isColliding(moveableObject) {
    return this.x + this.width > moveableObject.x &&
    this.y + this.height > moveableObject.y &&
    this.x < moveableObject.x &&
    this.y < moveableObject.y + moveableObject.height;

}

    /**
     * 
     * @param {Array} array - ['img/img1.png', 'img/img2' ...] 
     */

    loadImages(array){
        array.forEach((path) => {
            let img = new Image(); 
            img.src = path;
            this.imgCache[path] = img; 
        });
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