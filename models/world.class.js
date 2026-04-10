class World {


    character = new Character();
    enemies = [
    new Chicken(),
    new Chicken(),
    new Chicken(),
 
];
    clouds = [new Cloud()];

    backgroundObjects = [
        new backgroudObject('img/5_background/layers/air.png', 0),
        new backgroudObject('img/5_background/layers/3_third_layer/1.png', 0),
        new backgroudObject('img/5_background/layers/2_second_layer/1.png', 0),
        new backgroudObject('img/5_background/layers/1_first_layer/1.png', 0),
    ];

    canvas;
    ctx;
    keyboard;

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

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        
        
  

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