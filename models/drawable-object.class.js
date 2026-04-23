class Drawableobject {
    x = 120;
    y = 280; 
    height = 150;
    width = 100;
    img;
    imgCache = {};
    currentImages = 0;

    loadImage(path) {
        this.img = new Image(); 
        this.img.src = path;
    }

    draw(ctx) {
         ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

        drawFrame(ctx) {
        if(this instanceof Character || this instanceof Chicken) {
        ctx.beginPath();
        }
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
    
}