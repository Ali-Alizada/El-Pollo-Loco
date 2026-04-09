class World {


    character = new Character();
    enemies = [
    new Chicken(),
    new Chicken(),
    new Chicken(),
 
];
    clouds = [new Cloud()];

    backgroundObjects = [
        new backgroudObject('img/5_background/layers/3_third_layer/1.png', 0, 100),
        // new backgroudObject('img/5_background/layers/3_third_layer/2.png', 720, 200),
        // new backgroudObject('img/5_background/layers/2_second_layer/2.png'),
        // new backgroudObject('img/5_background/layers/1_first_layer/2.png'),
    ];

    canvas;
    ctx;
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.backgroundObjects);
  

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
        this.ctx.drawImage(moveableObject.img, moveableObject.x, moveableObject.y, moveableObject.width, moveableObject.height);
    }

    
    
}