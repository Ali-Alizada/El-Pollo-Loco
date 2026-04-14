class World {


    character = new Character();
    level = level1;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);

        this.ctx.translate(-this.camera_x, 0);
        
  

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
        if(moveableObject.otherDirection){
            this.ctx.save();
            this.ctx.translate(moveableObject.width, 0)
            this.ctx.scale(-1,1)
            moveableObject.x = moveableObject.x * -1;
        }
         
        this.ctx.drawImage(moveableObject.img, moveableObject.x, moveableObject.y, moveableObject.width, moveableObject.height);
        if(moveableObject.otherDirection){
            moveableObject.x = moveableObject.x * -1;
            this.ctx.restore();

        }
    }

    
    
}